import {io, Socket} from 'socket.io-client';

// In a real environment, this would be an env variable. 
// Creating a robust connection to the backend server.
const URL = 'http://172.21.30.221:3001';


export const socket: Socket = io(URL, {
    autoConnect: false,
    reconnection: true,
});

// Helper to ensure we don't duplicate listeners in React 18 strict mode
export const setupSocketListeners = (socket: Socket, listeners: Record<string, (data: any) => void>) => {
    Object.entries(listeners).forEach(([event, handler]) => {
        socket.off(event);
        socket.on(event, handler);
    });
};