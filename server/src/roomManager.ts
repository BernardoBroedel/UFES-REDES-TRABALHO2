import { Room, Player, Spectator } from './types';

// --- State ---
const rooms = new Map<string, Room>();

export function getRooms(): Map<string, Room> {
    return rooms;
}

export function getRoom(roomId: string): Room | undefined {
    return rooms.get(roomId);
}

export function createRoom(roomName: string, playerId: string, nickname: string): Room {
    const roomId = `room_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;

    const newRoom: Room = {
        id: roomId,
        name: roomName,
        players: [{id: playerId, symbol: 'X', nickname}],
        spectators: [],
        turn: 'X',
        board: Array(9).fill(null),
        winner: null
    };

    rooms.set(roomId, newRoom);
    return newRoom;
}

export function addPlayerToRoom(roomId: string, player: Player): boolean {
    const room = rooms.get(roomId);
    if (!room || room.players.length >= 2) {
        return false;
    }

    room.players.push(player);
    rooms.set(roomId, room);
    return true;
}

export function addSpectatorToRoom(roomId: string, spectator: Spectator): boolean {
    const room = rooms.get(roomId);
    if (!room) return false;

    // Evita duplicatas
    if (room.spectators.some(s => s.id === spectator.id)) return true;

    room.spectators.push(spectator);
    rooms.set(roomId, room);
    return true;
}

export function updateRoom(roomId: string, room: Room): void {
    rooms.set(roomId, room);
}

export function removePlayerFromRoom(roomId: string, playerId: string): Room | null {
    let targetRoomId: string | null = null;

    rooms.forEach((room, id) => {
        if (room.players.some(p => p.id === playerId)) {
            targetRoomId = id;
        }
    });

    if (!targetRoomId) return null;

    const room = rooms.get(targetRoomId)!;
    room.players = room.players.filter(p => p.id !== playerId);

    if (room.players.length === 0) {
        rooms.delete(targetRoomId);
        return null;
    } else {
        rooms.set(targetRoomId, room);
        return room;
    }
}

export function removeSpectatorFromRoom(roomId: string, spectatorId: string): Room | null {
    const room = rooms.get(roomId);
    if (!room) return null;

    room.spectators = room.spectators.filter(s => s.id !== spectatorId);
    rooms.set(roomId, room);
    return room;
}

export function findRoomByPlayerId(playerId: string): Room | null {
    for (const room of rooms.values()) {
        if (room.players.some(p => p.id === playerId)) {
            return room;
        }
    }
    return null;
}

export function findParticipationBySocketId(socketId: string): {room: Room; role: 'player' | 'spectator'} | null {
    for (const room of rooms.values()) {
        if (room.players.some(p => p.id === socketId)) {
            return {room, role: 'player'};
        }
        if (room.spectators.some(s => s.id === socketId)) {
            return {room, role: 'spectator'};
        }
    }
    return null;
}

