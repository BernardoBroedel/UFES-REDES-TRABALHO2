import { Server, Socket } from 'socket.io';
import { Player, Spectator } from './types';
import { checkWinner } from './gameLogic';
import {
    getRooms,
    getRoom,
    createRoom,
    addPlayerToRoom,
    addSpectatorToRoom,
    updateRoom,
    removePlayerFromRoom,
    removeSpectatorFromRoom,
    findParticipationBySocketId
} from './roomManager';

export function setupSocketHandlers(io: Server): void {
    io.on('connection', (socket: Socket) => {
        console.log(`Usuario conectado: ${socket.id}`);

        // 1. List Rooms (Filtered)
        socket.on('list_rooms', () => {
            const roomList = Array.from(getRooms().values()).map(r => ({
                id: r.id,
                name: r.name,
                playerCount: r.players.length,
                spectatorCount: r.spectators.length,
                status: r.winner ? 'Finalizado' : (r.players.length === 2 ? 'Jogando' : 'Esperando')
            }));
            socket.emit('room_list', roomList);
        });

        // 2. Create Room
        socket.on('create_room', ({roomName, nickname}) => {
            const newRoom = createRoom(roomName, socket.id, nickname);
            socket.join(newRoom.id);

            socket.emit('room_joined', newRoom);
            io.emit('room_list', Array.from(getRooms().values()).map(r => ({
                id: r.id,
                name: r.name,
                playerCount: r.players.length,
                spectatorCount: r.spectators.length,
                status: 'Esperando'
            })));
        });

        // 3. Join Room
        socket.on('join_room', ({roomId, nickname}) => {
            const room = getRoom(roomId);
            if (!room) return;

            if (room.players.length >= 2) {
                socket.emit('error', 'Sala está cheia');
                return;
            }

            const newPlayer: Player = {
                id: socket.id,
                symbol: 'O',
                nickname
            };

            const success = addPlayerToRoom(roomId, newPlayer);
            if (!success) {
                socket.emit('error', 'Sala está cheia');
                return;
            }

            socket.join(roomId);
            const updatedRoom = getRoom(roomId)!;

            io.to(roomId).emit('room_update', updatedRoom);
            socket.emit('room_joined', updatedRoom); // Inform the joiner

            // Notify lobby
            io.emit('room_list', Array.from(getRooms().values()).map(r => ({
                id: r.id,
                name: r.name,
                playerCount: r.players.length,
                spectatorCount: r.spectators.length,
                status: r.winner ? 'Finalizado' : (r.players.length === 2 ? 'Jogando' : 'Esperando')
            })));
        });

        // 3b. Join as Spectator
        socket.on('join_spectator', ({roomId, nickname}) => {
            const room = getRoom(roomId);
            if (!room) return;

            const spectator: Spectator = {
                id: socket.id,
                nickname
            };

            const success = addSpectatorToRoom(roomId, spectator);
            if (!success) return;

            socket.join(roomId);
            const updatedRoom = getRoom(roomId)!;

            socket.emit('room_joined', updatedRoom); // Spectator also receives state
            io.to(roomId).emit('room_update', updatedRoom);

            // Update Lobby
            io.emit('room_list', Array.from(getRooms().values()).map(r => ({
                id: r.id,
                name: r.name,
                playerCount: r.players.length,
                spectatorCount: r.spectators.length,
                status: r.winner ? 'Finalizado' : (r.players.length === 2 ? 'Jogando' : 'Esperando')
            })));
        });

        // 4. Make Move
        socket.on('make_move', ({roomId, index}) => {
            const room = getRoom(roomId);
            if (!room || room.winner) return;

            const player = room.players.find(p => p.id === socket.id);
            if (!player || player.symbol !== room.turn) return;
            if (room.board[index] !== null) return;

            // Update Board
            room.board[index] = player.symbol;

            // Check Win
            const winner = checkWinner(room.board);
            if (winner) {
                room.winner = winner;
                io.to(roomId).emit('game_over', {winner});
            } else {
                room.turn = room.turn === 'X' ? 'O' : 'X';
            }

            updateRoom(roomId, room);
            io.to(roomId).emit('room_update', room);
        });

        // 4b. Restart Game (same room)
        socket.on('restart_game', ({roomId}) => {
            const room = getRoom(roomId);
            if (!room) return;
            if (room.players.length < 2) return; // precisa de dois jogadores

            // Alterna símbolos para equilibrar inícios
            room.players = room.players.map(p => ({
                ...p,
                symbol: p.symbol === 'X' ? 'O' : 'X'
            }));

            room.board = Array(9).fill(null);
            room.winner = null;
            room.turn = 'X';

            updateRoom(roomId, room);
            io.to(roomId).emit('room_update', room);
            io.to(roomId).emit('chat_message', {
                sender: 'System',
                text: 'Nova partida iniciada na mesma sala.',
                isSystem: true,
                timestamp: Date.now()
            });
        });

        // 5. Chat (Visual Encryption)
        socket.on('send_message', ({roomId, text}) => {
            const room = getRoom(roomId);
            if (!room) return;
            const participant = room.players.find(p => p.id === socket.id) ||
                room.spectators.find(s => s.id === socket.id);
            if (!participant) return;

            const msgPayload = {
                sender: participant.nickname,
                text, // Already base64 from client
                timestamp: Date.now()
            };
            io.to(roomId).emit('chat_message', msgPayload);
        });

        // 6. Leave Room / Disconnect
        const handleLeave = (socketId: string) => {
            const participation = findParticipationBySocketId(socketId);
            if (!participation) return;

            const {room, role} = participation;

            if (role === 'player') {
                const remaining = room.players.find(p => p.id !== socketId);

                // Game Logic: W.O. if playing
                if (!room.winner && room.players.length === 2) {
                    room.winner = remaining ? remaining.symbol : 'DRAW';
                    updateRoom(room.id, room);
                    io.to(room.id).emit('chat_message', {
                        sender: 'System',
                        text: 'Jogador desconectado. Vitoria por W.O.',
                        isSystem: true,
                        timestamp: Date.now()
                    });
                    io.to(room.id).emit('game_over', {winner: room.winner});
                }

                // Remove player
                const updatedRoom = removePlayerFromRoom(room.id, socketId);
                socket.leave(room.id);
                socket.emit('left_room_confirmed');

                if (updatedRoom) {
                    io.to(room.id).emit('room_update', updatedRoom);
                }
            } else {
                // Spectator leaving
                const updatedRoom = removeSpectatorFromRoom(room.id, socketId);
                socket.leave(room.id);
                socket.emit('left_room_confirmed');

                if (updatedRoom) {
                    io.to(room.id).emit('room_update', updatedRoom);
                }
            }

            // Update Lobby after any leave
            io.emit('room_list', Array.from(getRooms().values()).map(r => ({
                id: r.id,
                name: r.name,
                playerCount: r.players.length,
                spectatorCount: r.spectators.length,
                status: r.winner ? 'Finalizado' : (r.players.length === 2 ? 'Jogando' : 'Esperando')
            })));
        };

        socket.on('leave_room', () => {
            handleLeave(socket.id);
        });

        socket.on('disconnect', () => {
            console.log(`Usuario desconectado: ${socket.id}`);
            handleLeave(socket.id);
        });
    });
}

