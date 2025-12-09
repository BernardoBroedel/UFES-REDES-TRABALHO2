import React, {useState, useEffect, useRef} from 'react';
import {socket} from '../services/socket';
import {Room, ChatMessage} from '../types';
import {Button} from './Button';

interface GameProps {
    initialRoom: Room;
    myPlayerId: string;
    onLeave: () => void;
}

export const Game: React.FC<GameProps> = ({initialRoom, myPlayerId, onLeave}) => {
    const [room, setRoom] = useState<Room>(initialRoom);
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onRoomUpdate = (updatedRoom: Room) => {
            setRoom(updatedRoom);
        };

        const onChatMessage = (msg: ChatMessage) => {
            // Visual decryption of base64
            const decodedMsg = {...msg};
            if (!msg.isSystem) {
                try {
                    decodedMsg.text = atob(msg.text);
                } catch (e) {
                    decodedMsg.text = "*** Dado corrompido ***";
                }
            }
            setChatHistory(prev => [...prev, decodedMsg]);
        };

        socket.on('room_update', onRoomUpdate);
        socket.on('chat_message', onChatMessage);
        socket.on('game_over', (data) => {
            // Could add a toast here
            console.log("Game Over", data);
        });

        return () => {
            socket.off('room_update', onRoomUpdate);
            socket.off('chat_message', onChatMessage);
            socket.off('game_over');
        };
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [chatHistory]);

    const handleSquareClick = (index: number) => {
        if (
            isSpectator ||
            room.board[index] ||
            room.winner ||
            room.players.length < 2 ||
            room.players.find(p => p.id === myPlayerId)?.symbol !== room.turn
        ) return;

        socket.emit('make_move', {roomId: room.id, index});
    };

    const handleLeave = () => {
        socket.emit('leave_room', {roomId: room.id});
        onLeave();
    };

    const handleRestart = () => {
        if (isSpectator) return;
        socket.emit('restart_game', {roomId: room.id});
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Simple Base64 "Encryption"
        const encodedMessage = btoa(message);
        socket.emit('send_message', {roomId: room.id, text: encodedMessage});
        setMessage('');
    };

    const myPlayer = room.players.find(p => p.id === myPlayerId);
    const opponent = room.players.find(p => p.id !== myPlayerId);
    const isSpectator = !myPlayer;
    const isMyTurn = !isSpectator && room.turn === myPlayer?.symbol;

    return (
        <div className="w-full max-w-5xl grid lg:grid-cols-3 gap-6">

            {/* Game Area */}
            <div
                className="lg:col-span-2 bg-slate-900/80 backdrop-blur-xl p-6 rounded-2xl border border-slate-700 shadow-2xl flex flex-col items-center justify-center">

                <div className="w-full flex flex-col gap-3 mb-6 border-b border-slate-700 pb-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                            {isSpectator ? (
                                <div className="px-3 py-1 rounded font-bold bg-slate-800 text-slate-200 border border-slate-600">
                                    Modo espectador
                                </div>
                            ) : (
                                <div
                                    className={`px-3 py-1 rounded font-bold ${myPlayer?.symbol === 'X' ? 'bg-neon-blue/20 text-neon-blue' : 'bg-neon-pink/20 text-neon-pink'}`}>
                                    VOCÊ: {myPlayer?.symbol} ({myPlayer?.nickname})
                                </div>
                            )}
                        </div>
                        <div className="text-xl font-black tracking-widest text-slate-500">
                            VS
                        </div>
                        <div className="flex items-center gap-2">
                            {['X', 'O'].map((symbol) => {
                                const p = room.players.find(player => player.symbol === symbol);
                                return (
                                    <div
                                        key={symbol}
                                        className={`px-3 py-1 rounded font-bold ${symbol === 'X' ? 'bg-neon-blue/20 text-neon-blue' : 'bg-neon-pink/20 text-neon-pink'}`}>
                                        {p ? `${p.nickname} (${symbol})` : `Aguardando ${symbol}`}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {isSpectator && (
                        <span className="text-xs text-slate-500">Você está assistindo esta sala; jogadas estão desativadas.</span>
                    )}
                </div>

                <div className="mb-6">
                    {room.winner ? (
                        <div className="text-3xl font-black text-center animate-bounce">
                            {room.winner === 'DRAW' ? (
                                <span className="text-yellow-400">EMPATE</span>
                            ) : (
                                <span className={isSpectator ? "text-sky-300" : (room.winner === myPlayer?.symbol ? "text-green-400" : "text-red-500")}>
                                    {isSpectator
                                        ? `Vitória de ${room.winner}`
                                        : room.winner === myPlayer?.symbol ? "VOCÊ GANHOU!" : "VOCÊ PERDEU!"}
                                </span>
                            )}
                        </div>
                    ) : (
                        <div
                            className={`text-xl font-bold text-center ${isMyTurn ? "text-green-400 animate-pulse" : "text-slate-500"}`}>
                            {room.players.length < 2
                                ? "Esperando por jogador..."
                                : isSpectator
                                    ? `Assistindo: vez de ${room.turn}`
                                    : (isMyTurn ? "SUA VEZ" : `Vez de ${opponent?.nickname}`)}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-3 bg-slate-800 p-3 rounded-xl shadow-inner">
                    {room.board.map((cell, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleSquareClick(idx)}
                            disabled={!!cell || !!room.winner || room.players.length < 2 || isSpectator}
                            className={`w-20 h-20 md:w-24 md:h-24 rounded-lg text-4xl md:text-5xl font-black flex items-center justify-center transition-all duration-150 
                ${!cell && !room.winner && isMyTurn ? "hover:bg-slate-700 cursor-pointer" : "cursor-default"}
                ${cell === 'X' ? "text-neon-blue drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]" : "text-neon-pink drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]"}
                ${!cell ? "bg-slate-900" : "bg-slate-900/50"}
              `}
                        >
                            {cell}
                        </button>
                    ))}
                </div>

                <div className="w-full mt-8 flex justify-end">
                    {room.winner && (
                        <Button
                            variant="outline"
                            onClick={handleRestart}
                            className="mr-3"
                            disabled={isSpectator || room.players.length < 2}
                        >
                            Jogar novamente
                        </Button>
                    )}
                    <Button variant="danger" onClick={handleLeave}>
                        Deixar sala
                    </Button>
                </div>
            </div>

            {/* Chat Area */}
            <div
                className="bg-slate-900/80 backdrop-blur-xl flex flex-col rounded-2xl border border-slate-700 shadow-2xl h-[585px] overflow-hidden">
                <div className="p-4 bg-slate-800 border-b border-slate-700">
                    <h3 className="font-bold text-slate-200 flex items-center gap-2">
                        <span className="text-green-500">●</span> Chat
                    </h3>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50">
                    {chatHistory.map((msg, i) => (
                        <div key={i}
                             className={`flex flex-col ${msg.sender === myPlayer?.nickname ? 'items-end' : 'items-start'}`}>
                            {msg.isSystem ? (
                                <span
                                    className="text-xs text-yellow-500 italic w-full text-center my-1">{msg.text}</span>
                            ) : (
                                <>
                                    <span className="text-[10px] text-slate-500 mb-1">{msg.sender}</span>
                                    <div
                                        className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${msg.sender === myPlayer?.nickname ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'}`}>
                                        {msg.text}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                    <div ref={chatEndRef}/>
                </div>

                <form onSubmit={handleSendMessage} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
                    <input
                        className="flex-1 bg-slate-900 border border-slate-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neon-blue"
                        placeholder="Escreva uma mensagem..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-neon-purple hover:bg-purple-600 text-white px-4 py-2 rounded text-sm font-bold transition-colors"
                        disabled={!message.trim()}
                    >
                        Enviar
                    </button>
                </form>
            </div>

        </div>
    );
};