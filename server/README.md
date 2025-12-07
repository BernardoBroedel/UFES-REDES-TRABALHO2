# 🎮 Servidor de Jogo da Velha Multiplayer

Servidor Node.js/TypeScript para um jogo da velha multiplayer em tempo real utilizando WebSockets (Socket.IO). Este servidor gerencia salas de jogo, sincroniza movimentos entre jogadores e fornece um sistema de chat em tempo real.

---

## 👥 Autores

Desenvolvido para o curso de **Redes de Computadores** - **UFES**.

Athila Archanji Rodrigues

Bernardo Vargens Broedel

---

## 📋 Índice

- [Características](#-características)
- [Requisitos](#-requisitos)
- [Instalação](#-instalação)
- [Como Utilizar](#-como-utilizar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [API de Eventos Socket.IO](#-api-de-eventos-socketio)
- [Teoria: Comunicação via WebSockets](#-teoria-comunicação-via-websockets)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Fluxo de Comunicação](#-fluxo-de-comunicação)
- [Exemplos de Uso](#-exemplos-de-uso)

---

## ✨ Características

- ✅ **Jogo da Velha Multiplayer**: Suporte para múltiplas salas simultâneas
- ✅ **Tempo Real**: Comunicação bidirecional instantânea via WebSockets
- ✅ **Sistema de Salas**: Criação e gerenciamento dinâmico de salas de jogo
- ✅ **Chat em Tempo Real**: Sistema de mensagens entre jogadores
- ✅ **Gerenciamento de Estado**: Controle de turnos, tabuleiro e vencedores
- ✅ **Tratamento de Desconexões**: Lógica de vitória por W.O. quando jogador desconecta
- ✅ **TypeScript**: Código tipado e organizado em módulos

---

## 📦 Requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x (ou yarn/pnpm)

---

## 🚀 Instalação

1. **Clone o repositório** (se aplicável) ou navegue até a pasta do servidor:
   ```bash
   cd server
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Verifique a instalação**:
   ```bash
   npm list
   ```

---

## 💻 Como Utilizar

### Modo Desenvolvimento (com hot-reload)

Execute o servidor em modo de desenvolvimento com recarregamento automático:

```bash
npm run dev
```

O servidor iniciará na porta **3001** e ficará observando mudanças nos arquivos, recarregando automaticamente.

### Modo Produção

Execute o servidor em modo produção:

```bash
npm start
```

### Verificando o Servidor

Após iniciar, você verá a mensagem:
```
Server running on http://localhost:3001
```

O servidor estará pronto para receber conexões Socket.IO na porta 3001.

### Configuração de Porta

Para alterar a porta, edite o arquivo `src/server.ts`:

```typescript
const PORT = 3001; // Altere para a porta desejada
```

---

## 📁 Estrutura do Projeto

```
server/
├── src/
│   ├── types.ts           # Interfaces TypeScript (Player, Room)
│   ├── gameLogic.ts       # Lógica do jogo (verificação de vencedor)
│   ├── roomManager.ts     # Gerenciamento de salas e jogadores
│   ├── socketHandlers.ts  # Handlers de eventos Socket.IO
│   └── server.ts          # Arquivo principal (Express + Socket.IO)
├── package.json           # Dependências e scripts
├── tsconfig.json          # Configuração TypeScript
└── README.md              # Esta documentação
```

### Descrição dos Módulos

#### `types.ts`
Define as interfaces TypeScript utilizadas em todo o projeto:
- `Player`: Representa um jogador (id, símbolo X/O, nickname)
- `Room`: Representa uma sala de jogo (id, nome, jogadores, tabuleiro, estado)

#### `gameLogic.ts`
Contém a lógica de verificação de vitória do jogo da velha:
- `checkWinner()`: Verifica se há vencedor ou empate no tabuleiro
- `WIN_COMBINATIONS`: Array com todas as combinações vencedoras possíveis

#### `roomManager.ts`
Gerencia o estado das salas em memória:
- Criação e remoção de salas
- Adição/remoção de jogadores
- Busca e atualização de salas
- Utiliza `Map<string, Room>` para armazenamento em memória

#### `socketHandlers.ts`
Implementa todos os handlers de eventos Socket.IO:
- Conexão/desconexão de clientes
- Criação e entrada em salas
- Movimentos do jogo
- Sistema de chat
- Atualização de listas de salas

#### `server.ts`
Arquivo principal que inicializa:
- Servidor HTTP (Express)
- Servidor Socket.IO
- Configuração de CORS
- Setup dos handlers de eventos

---

## 🔌 API de Eventos Socket.IO

### Eventos Recebidos pelo Servidor (Client → Server)

#### `list_rooms`
Solicita a lista de todas as salas disponíveis.

**Payload**: Nenhum

**Resposta**: Evento `room_list` com array de salas

---

#### `create_room`
Cria uma nova sala de jogo.

**Payload**:
```typescript
{
  roomName: string;    // Nome da sala
  nickname: string;     // Apelido do criador
}
```

**Respostas**:
- `room_joined`: Enviado ao criador com os dados da sala criada
- `room_list`: Broadcast para todos os clientes atualizando a lista

**Exemplo**:
```javascript
socket.emit('create_room', {
  roomName: 'Sala do João',
  nickname: 'João'
});
```

---

#### `join_room`
Entra em uma sala existente.

**Payload**:
```typescript
{
  roomId: string;      // ID da sala
  nickname: string;     // Apelido do jogador
}
```

**Respostas**:
- `room_joined`: Enviado ao jogador que entrou
- `room_update`: Broadcast para todos na sala
- `room_list`: Broadcast para todos os clientes
- `error`: Se a sala estiver cheia ou não existir

**Exemplo**:
```javascript
socket.emit('join_room', {
  roomId: 'room_1234567890_abc123',
  nickname: 'Maria'
});
```

---

#### `make_move`
Realiza uma jogada no tabuleiro.

**Payload**:
```typescript
{
  roomId: string;      // ID da sala
  index: number;       // Índice da posição (0-8)
}
```

**Validações**:
- Sala deve existir
- Jogo não deve ter terminado
- Deve ser o turno do jogador
- Posição deve estar vazia

**Respostas**:
- `room_update`: Broadcast para todos na sala com o novo estado
- `game_over`: Se houver vencedor ou empate

**Exemplo**:
```javascript
socket.emit('make_move', {
  roomId: 'room_1234567890_abc123',
  index: 4  // Posição central
});
```

---

#### `send_message`
Envia uma mensagem no chat da sala.

**Payload**:
```typescript
{
  roomId: string;      // ID da sala
  text: string;        // Mensagem (já codificada em base64 pelo cliente)
}
```

**Resposta**:
- `chat_message`: Broadcast para todos na sala

**Exemplo**:
```javascript
socket.emit('send_message', {
  roomId: 'room_1234567890_abc123',
  text: 'SGVsbG8gV29ybGQ='  // Base64
});
```

---

#### `leave_room`
Sai da sala atual.

**Payload**: Nenhum

**Respostas**:
- `left_room_confirmed`: Confirmação para o jogador que saiu
- `room_update`: Broadcast para os jogadores restantes na sala
- `room_list`: Broadcast para todos atualizando a lista

---

### Eventos Enviados pelo Servidor (Server → Client)

#### `room_list`
Lista atualizada de todas as salas.

**Payload**:
```typescript
Array<{
  id: string;
  name: string;
  playerCount: number;
  status: 'Waiting' | 'Playing' | 'Finished';
}>
```

---

#### `room_joined`
Confirmação de entrada em uma sala.

**Payload**: Objeto `Room` completo

---

#### `room_update`
Atualização do estado da sala.

**Payload**: Objeto `Room` completo com estado atualizado

---

#### `game_over`
Notificação de fim de jogo.

**Payload**:
```typescript
{
  winner: 'X' | 'O' | 'DRAW';
}
```

---

#### `chat_message`
Mensagem recebida no chat.

**Payload**:
```typescript
{
  sender: string;          // Apelido do remetente ou 'System'
  text: string;            // Mensagem (base64)
  timestamp: number;       // Timestamp Unix
  isSystem?: boolean;      // Se for mensagem do sistema
}
```

---

#### `error`
Erro ocorrido.

**Payload**: `string` com mensagem de erro

**Exemplos**:
- `"Room is full"`
- `"Room not found"`

---

#### `left_room_confirmed`
Confirmação de saída da sala.

**Payload**: Nenhum

---

## 🧠 Teoria: Comunicação via WebSockets

### O que são WebSockets?

**WebSockets** é um protocolo de comunicação que estabelece uma conexão **full-duplex** (bidirecional) e **persistente** entre cliente e servidor sobre uma única conexão TCP. Diferente do modelo HTTP tradicional (request/response), os WebSockets permitem que tanto o cliente quanto o servidor enviem dados a qualquer momento, sem necessidade de requisições.

### Comparação: HTTP vs WebSockets

#### HTTP (Request/Response)
```
Cliente                    Servidor
   |                          |
   |--- GET /api/rooms ------>|
   |                          |
   |<-- JSON Response --------|
   |                          |
   |--- POST /api/move ------>|
   |                          |
   |<-- JSON Response --------|
```

**Características**:
- ❌ Cliente sempre inicia a comunicação
- ❌ Conexão fechada após cada resposta
- ❌ Overhead de headers HTTP em cada requisição
- ✅ Simples e stateless
- ✅ Cacheável

#### WebSockets (Bidirectional)
```
Cliente                      Servidor
   |                            |
   |--- WebSocket Handshake --->|
   |<-- Connection Established--|
   |                            |
   |<-- Event: room_update -----|  (Servidor pode enviar a qualquer momento)
   |                            |
   |--- Event: make_move ------>|  (Cliente pode enviar a qualquer momento)
   |                            |
   |<-- Event: room_update -----|
```

**Características**:
- ✅ Comunicação bidirecional
- ✅ Conexão persistente
- ✅ Baixo overhead após handshake inicial
- ✅ Ideal para aplicações em tempo real
- ✅ Suporte a eventos customizados

### Socket.IO: Abstração sobre WebSockets

**Socket.IO** é uma biblioteca JavaScript que fornece uma abstração sobre WebSockets, oferecendo:

1. **Fallback Automático**: Se WebSockets não estiver disponível, usa polling HTTP
2. **Reconexão Automática**: Reconecta automaticamente em caso de queda
3. **Rooms e Namespaces**: Organização de clientes em grupos
4. **Eventos Customizados**: Sistema de eventos nomeados (não apenas mensagens genéricas)
5. **Broadcasting**: Envio de mensagens para múltiplos clientes facilmente

### Handshake WebSocket

O processo de estabelecimento de conexão WebSocket:

```
1. Cliente envia HTTP Upgrade Request:
   GET /socket.io/?EIO=4&transport=websocket HTTP/1.1
   Upgrade: websocket
   Connection: Upgrade
   Sec-WebSocket-Key: [chave]
   Sec-WebSocket-Version: 13

2. Servidor responde:
   HTTP/1.1 101 Switching Protocols
   Upgrade: websocket
   Connection: Upgrade
   Sec-WebSocket-Accept: [chave aceita]

3. Conexão estabelecida - comunicação bidirecional iniciada
```

### Modelo de Eventos Socket.IO

Socket.IO utiliza um modelo baseado em **eventos nomeados**:

```javascript
// Cliente envia evento
socket.emit('make_move', { roomId: '...', index: 4 });

// Servidor escuta evento
socket.on('make_move', (data) => {
  // Processa o movimento
});

// Servidor envia evento
io.to(roomId).emit('room_update', roomData);

// Cliente escuta evento
socket.on('room_update', (room) => {
  // Atualiza interface
});
```

### Rooms (Salas) no Socket.IO

**Rooms** são canais virtuais que permitem agrupar sockets:

```javascript
// Cliente entra em uma sala
socket.join('room_123');

// Servidor envia para todos na sala
io.to('room_123').emit('room_update', data);

// Servidor envia para todos EXCETO o remetente
socket.to('room_123').emit('message', data);

// Servidor envia para todos os clientes
io.emit('room_list', rooms);
```

**Vantagens**:
- Isolamento de comunicação por contexto (sala de jogo)
- Broadcasting eficiente para grupos específicos
- Gerenciamento simplificado de múltiplas sessões

### Tipos de Broadcasting

1. **`socket.emit()`**: Envia apenas para o socket específico
2. **`socket.to(room).emit()`**: Envia para todos na sala, exceto o remetente
3. **`io.to(room).emit()`**: Envia para todos na sala, incluindo o remetente
4. **`io.emit()`**: Envia para todos os clientes conectados

---

## 🏗️ Arquitetura do Sistema

### Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────┐
│                    Cliente (Browser)                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Lobby UI   │  │   Game UI    │  │   Chat UI    │   │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘   │
│         │                 │                 │           │
│         └─────────────────┼─────────────────┘           │
│                           │                             │
│                    ┌──────▼──────┐                      │
│                    │ Socket.IO   │                      │
│                    │   Client     │                     │
│                    └──────┬──────┘                      │
└───────────────────────────┼─────────────────────────────┘
                            │ WebSocket Connection
                            │
┌───────────────────────────▼─────────────────────────────┐
│                    Servidor Node.js                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │              server.ts                           │   │
│  │  ┌──────────────┐         ┌──────────────┐       │   │
│  │  │   Express    │         │  Socket.IO   │       │   │
│  │  │   (HTTP)     │         │   Server     │       │   │
│  │  └──────────────┘         └──────┬───────┘       │   │
│  └─────────────────────────────────┼────────────────┘   │
│                                    │                    │
│  ┌─────────────────────────────────▼──────────────┐     │
│  │         socketHandlers.ts                      │     │
│  │  • Event Listeners                             │     │
│  │  • Business Logic                              │     │
│  └──────┬──────────────┬──────────────┬───────────┘     │
│         │              │              │                 │
│  ┌──────▼──────┐ ┌─────▼─────┐ ┌─────▼──────┐           │
│  │ gameLogic   │ │ roomMgr   │ │   types    │           │
│  │             │ │           │ │            │           │
│  │ checkWinner │ │ createRoom│ │ Player     │           │
│  │             │ │ addPlayer │ │ Room       │           │
│  └─────────────┘ └───────────┘ └────────────┘           │
│                                                         │
│  ┌───────────────────────────────────────────────┐      │
│  │         Estado em Memória                     │      │
│  │  Map<string, Room> rooms                      │      │
│  └───────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────┘
```

### Fluxo de Dados

1. **Cliente conecta** → Socket.IO estabelece conexão WebSocket
2. **Cliente emite evento** → Dados trafegam via WebSocket
3. **Servidor processa** → Handlers executam lógica de negócio
4. **Estado atualizado** → Room Manager atualiza estado em memória
5. **Broadcast** → Servidor envia atualizações para clientes relevantes
6. **Cliente recebe** → Interface atualizada em tempo real

### Gerenciamento de Estado

O servidor mantém o estado das salas em **memória** usando uma `Map<string, Room>`:

```typescript
const rooms = new Map<string, Room>();
```

**Características**:
- ⚡ **Rápido**: Acesso O(1) por ID
- 💾 **Volátil**: Estado perdido ao reiniciar servidor
- 🔄 **Sincronizado**: Todas as operações são síncronas

**Para produção**, considere:
- Persistência em banco de dados (Redis, MongoDB)
- Sistema de cache distribuído
- Replicação de estado entre instâncias

---

## 🔄 Fluxo de Comunicação

### 1. Conexão Inicial

```
Cliente                          Servidor
   |                                |
   |--- WebSocket Connect --------->|
   |                                |
   |<-- Connection Established -----|
   |                                |
   |--- emit('list_rooms') -------->|
   |                                | [Busca salas]
   |<-- emit('room_list', [...]) ---|
```

### 2. Criação de Sala

```
Cliente A                        Servidor                    Cliente B
   |                                |                            |
   |--- emit('create_room') ------->|                            |
   |                                | [Cria sala]                |
   |                                | [Adiciona Cliente A]       |
   |<-- emit('room_joined') --------|                            |
   |                                |                            |
   |                                |--- emit('room_list') ----->|
   |                                |                            |
```

### 3. Entrada em Sala

```
Cliente B                        Servidor                    Cliente A
   |                                |                            |
   |--- emit('join_room') --------->|                            |
   |                                | [Adiciona Cliente B]       |
   |                                |--- emit('room_update') --->|
   |<-- emit('room_joined') --------|                            |
   |                                |--- emit('room_list') ----->|
```

### 4. Movimento no Jogo

```
Cliente A                        Servidor                    Cliente B
   |                                |                            |
   |--- emit('make_move') --------->|                            |
   |                                | [Valida movimento]         |
   |                                | [Atualiza tabuleiro]       |
   |                                | [Verifica vencedor]        |
   |                                |--- emit('room_update') --->|
   |<-- emit('room_update') --------|                            |
   |                                |                            |
```

### 5. Desconexão

```
Cliente A                        Servidor                    Cliente B
   |                                |                            |
   |--- [Disconnect] -------------->|                            |
   |                                | [Detecta desconexão]       |
   |                                | [Remove Cliente A]         |
   |                                | [Atualiza estado]          |
   |                                |--- emit('room_update') --->|
   |                                |--- emit('room_list') ----->|
```

---

## 📝 Exemplos de Uso

### Exemplo 1: Cliente Básico (JavaScript)

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

// Conectar
socket.on('connect', () => {
  console.log('Conectado:', socket.id);
});

// Listar salas
socket.emit('list_rooms');
socket.on('room_list', (rooms) => {
  console.log('Salas disponíveis:', rooms);
});

// Criar sala
socket.emit('create_room', {
  roomName: 'Minha Sala',
  nickname: 'Jogador1'
});

socket.on('room_joined', (room) => {
  console.log('Entrei na sala:', room);
});

// Fazer movimento
socket.emit('make_move', {
  roomId: room.id,
  index: 4
});

socket.on('room_update', (room) => {
  console.log('Estado atualizado:', room);
});

socket.on('game_over', ({ winner }) => {
  console.log('Fim de jogo! Vencedor:', winner);
});
```

### Exemplo 2: Tratamento de Erros

```javascript
socket.on('error', (errorMessage) => {
  console.error('Erro:', errorMessage);
  
  if (errorMessage === 'Room is full') {
    alert('A sala está cheia!');
  }
});
```

### Exemplo 3: Chat

```javascript
// Enviar mensagem
const message = btoa('Olá, jogadores!'); // Base64 encode
socket.emit('send_message', {
  roomId: room.id,
  text: message
});

// Receber mensagens
socket.on('chat_message', ({ sender, text, timestamp }) => {
  const decodedMessage = atob(text); // Base64 decode
  console.log(`${sender}: ${decodedMessage}`);
});
```

### Exemplo 4: Gerenciamento de Sala

```javascript
// Entrar em sala
socket.emit('join_room', {
  roomId: 'room_1234567890_abc123',
  nickname: 'Jogador2'
});

// Sair da sala
socket.emit('leave_room');
socket.on('left_room_confirmed', () => {
  console.log('Sai da sala com sucesso');
});
```
---

## 📄 Licença

Este projeto é parte de um trabalho acadêmico da UFES.

---

## 📚 Referências

- [Socket.IO Documentation](https://socket.io/docs/v4/)
- [WebSocket Protocol (RFC 6455)](https://tools.ietf.org/html/rfc6455)
- [MDN WebSockets API](https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---

