import React, {useState, useEffect, useRef} from 'react';
import {Lobby} from './components/Lobby';
import {Game} from './components/Game';
import {socket} from './services/socket';
import {Room, AppState} from './types';

const App: React.FC = () => {
    const [state, setState] = useState<AppState>(AppState.LOBBY);
    const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
    const [nickname, setNickname] = useState('');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Configurar música de fundo
        const audio = new Audio('/background-music.mp3');
        audio.loop = true;
        audio.volume = 0.1; // Volume em 10% (ajuste conforme necessário)
        
        // Tentar reproduzir (pode falhar se o usuário não interagiu com a página)
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(() => {
                // Autoplay bloqueado - será reproduzido após interação do usuário
                console.log('Autoplay bloqueado. A música iniciará após interação do usuário.');
            });
        }
        
        audioRef.current = audio;

        // Reproduzir após primeira interação do usuário
        const handleUserInteraction = () => {
            if (audio.paused) {
                audio.play().catch(() => {
                    console.log('Não foi possível reproduzir a música.');
                });
            }
            // Remove o listener após primeira interação
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };

        document.addEventListener('click', handleUserInteraction);
        document.addEventListener('keydown', handleUserInteraction);

        return () => {
            // Cleanup: pausar e limpar áudio ao desmontar
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
            document.removeEventListener('click', handleUserInteraction);
            document.removeEventListener('keydown', handleUserInteraction);
        };
    }, []);

    useEffect(() => {
        // Connect to socket when app loads
        socket.connect();

        const handleRoomJoined = (room: Room) => {
            setCurrentRoom(room);
            setState(AppState.GAME);
        };

        const handleLeftRoom = () => {
            setCurrentRoom(null);
            setState(AppState.LOBBY);
        };

        socket.on('room_joined', handleRoomJoined);
        socket.on('left_room_confirmed', handleLeftRoom);

        return () => {
            socket.off('room_joined', handleRoomJoined);
            socket.off('left_room_confirmed', handleLeftRoom);
            socket.disconnect();
        };
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">

            {state === AppState.LOBBY && (
                <Lobby nickname={nickname} setNickname={setNickname}/>
            )}

            {state === AppState.GAME && currentRoom && (
                <Game
                    initialRoom={currentRoom}
                    myPlayerId={socket.id || ''}
                    onLeave={() => setState(AppState.LOBBY)}
                />
            )}
        </div>
    );
};

export default App;
