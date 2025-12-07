import express from 'express';
import {createServer} from 'http';
import {Server} from 'socket.io';
import cors from 'cors';
import { setupSocketHandlers } from './socketHandlers';
import { networkInterfaces } from 'os';

const app = express();

app.use(cors());

const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Setup Socket.IO handlers
setupSocketHandlers(io);

// Função para obter o IP IPv4 da rede local (formato 192.168.x.x)
function getLocalIP(): string | null {
    const interfaces = networkInterfaces();

    for (const name of Object.keys(interfaces)) {
        const nets = interfaces[name];
        if (!nets) continue;

        for (const net of nets) {
            // Busca apenas IPv4 que não seja loopback
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }

    return null;
}

const PORT = 3001;
httpServer.listen(PORT, () => {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 Servidor rodando!');
    console.log('='.repeat(80));
    console.log(`📍 Local:     http://localhost:${PORT}`);

    const interfaces = networkInterfaces();

    // Lista todas as interfaces disponíveis
    Object.keys(interfaces).forEach((ifaceName) => {
        interfaces[ifaceName]?.forEach((iface) => {
            if (iface.family === 'IPv4' && !iface.internal) {
                console.log(`🌐 Rede (${ifaceName}): http://${iface.address}:${PORT}`);
            }
        });
    });

    console.log('\n💡 Copie o IP que corresponde à sua rede Wi-Fi/Ethernet.');
    console.log('='.repeat(80) + '\n');
});
