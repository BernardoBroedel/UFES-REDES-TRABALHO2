import { Server, Socket } from 'socket.io';
import { Room, Player } from './types';
import { checkWinner } from './gameLogic';
import {
    getRooms,
    getRoom,
    createRoom,
    addPlayerToRoom,
    updateRoom,
    removePlayerFromRoom,
    findRoomByPlayerId
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
                id: r.id, name: r.name, playerCount: r.players.length, status: 'Esperando'
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
                id: r.id, name: r.name, playerCount: r.players.length, status: r.winner ? 'Finalizado' : 'Jogando'
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

        // 5. Chat (Visual Encryption)
        socket.on('send_message', ({roomId, text}) => {
            const room = getRoom(roomId);
            if (!room) return;
            const player = room.players.find(p => p.id === socket.id);
            if (!player) return;

            const msgPayload = {
                sender: player.nickname,
                text, // Already base64 from client
                timestamp: Date.now()
            };
            io.to(roomId).emit('chat_message', msgPayload);
        });

        // 6. Leave Room / Disconnect
        const handleLeave = (socketId: string) => {
            const room = findRoomByPlayerId(socketId);

            if (room) {
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

                // Update Lobby
                io.emit('room_list', Array.from(getRooms().values()).map(r => ({
                    id: r.id,
                    name: r.name,
                    playerCount: r.players.length,
                    status: r.winner ? 'Finalizado' : (r.players.length === 2 ? 'Jogando' : 'Esperando')
                })));
            }
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

