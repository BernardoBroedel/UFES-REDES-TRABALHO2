import React, {useState, useEffect} from 'react';
import {socket} from '../services/socket';
import {Button} from './Button';
import {Input} from './Input';

interface RoomSummary {
    id: string;
    name: string;
    playerCount: number;
    status: string;
}

interface LobbyProps {
    nickname: string;
    setNickname: (name: string) => void;
}

export const Lobby: React.FC<LobbyProps> = ({nickname, setNickname}) => {
    const [rooms, setRooms] = useState<RoomSummary[]>([]);
    const [newRoomName, setNewRoomName] = useState('');

    useEffect(() => {
        // Request initial room list
        socket.emit('list_rooms');

        const handleRoomList = (data: RoomSummary[]) => {
            setRooms(data);
        };

        socket.on('room_list', handleRoomList);

        return () => {
            socket.off('room_list', handleRoomList);
        };
    }, []);

    const handleCreateRoom = (e: React.FormEvent) => {
        e.preventDefault();
        if (!nickname) return alert("Escolha seu nome de jogador");
        if (!newRoomName) return alert("Escolha o nome da sala");

        socket.emit('create_room', {roomName: newRoomName, nickname});
    };

    const handleJoinRoom = (roomId: string) => {
        if (!nickname) return alert("Por favor, escolha um nome de jogador antes de entrar em uma sala.");
        socket.emit('join_room', {roomId, nickname});
    };

    return (
        <div
            className="max-w-2xl w-full bg-slate-900/80 backdrop-blur-xl p-8 rounded-2xl border border-slate-700 shadow-2xl">
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple mb-8 text-center uppercase tracking-tighter">
                Jogo da Velha Cyberpunk
            </h1>

            <div className="mb-8 space-y-4">
                <Input
                    label="Nome de jogador"
                    placeholder="Escolha seu nome de jogador..."
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    maxLength={12}
                />
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-neon-blue rounded-full animate-pulse"></span>
                        Criar sala
                    </h2>
                    <form onSubmit={handleCreateRoom} className="space-y-4">
                        <Input
                            placeholder="Nome da sala"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            maxLength={15}
                        />
                        <Button type="submit" className="w-full" disabled={!nickname || !newRoomName}>
                            Criar e jogar
                        </Button>
                    </form>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 flex flex-col h-64">
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-neon-purple rounded-full"></span>
                        Salas ativas
                    </h2>
                    <div className="overflow-y-auto flex-1 pr-2 space-y-3">
                        {rooms.length === 0 ? (
                            <p className="text-slate-500 text-center mt-10 italic">Nenhuma sala ativa. Crie uma!</p>
                        ) : (
                            rooms.map((room) => (
                                <div key={room.id}
                                     className="flex items-center justify-between bg-slate-900 p-3 rounded-lg border border-slate-700">
                                    <div>
                                        <p className="font-bold text-sm text-slate-200">{room.name}</p>
                                        <p className="text-xs text-slate-500">{room.playerCount}/2 Jogadores
                                            • {room.status}</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="text-xs py-1 px-3"
                                        onClick={() => handleJoinRoom(room.id)}
                                        disabled={room.playerCount >= 2 || !nickname}
                                    >
                                        {room.playerCount >= 2 ? 'Cheio' : 'Entrar'}
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};