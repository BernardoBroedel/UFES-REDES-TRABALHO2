# 🎮 Cliente de Jogo da Velha Multiplayer

Cliente React/TypeScript para um jogo da velha multiplayer em tempo real utilizando WebSockets (Socket.IO). Interface moderna com design cyberpunk que permite criar salas, jogar em tempo real e comunicar-se via chat.

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
- [Componentes](#-componentes)
- [API de Eventos Socket.IO (Cliente)](#-api-de-eventos-socketio-cliente)
- [Teoria: Cliente WebSocket e React](#-teoria-cliente-websocket-e-react)
- [Arquitetura do Cliente](#-arquitetura-do-cliente)
- [Fluxo de Dados no Cliente](#-fluxo-de-dados-no-cliente)
- [Gerenciamento de Estado](#-gerenciamento-de-estado)
- [Exemplos de Uso](#-exemplos-de-uso)

---

## ✨ Características

- ✅ **Interface Moderna**: Design cyberpunk com efeitos neon e animações
- ✅ **Tempo Real**: Sincronização instantânea de movimentos e chat
- ✅ **React Hooks**: Gerenciamento de estado com hooks modernos
- ✅ **TypeScript**: Código totalmente tipado
- ✅ **Responsivo**: Interface adaptável para diferentes tamanhos de tela
- ✅ **Chat em Tempo Real**: Sistema de mensagens com "criptografia visual" (Base64)
- ✅ **Gerenciamento de Salas**: Criação e entrada em salas de jogo
- ✅ **Feedback Visual**: Indicadores de turno, vencedor e status do jogo

---

## 📦 Requisitos

- **Node.js** >= 18.x
- **npm** >= 9.x (ou yarn/pnpm)
- **Servidor Socket.IO** rodando (ver documentação do servidor)

---

## 🚀 Instalação

1. **Navegue até a pasta do cliente**:
   ```bash
   cd client
   ```

2. **Instale as dependências**:
   ```bash
   npm install
   ```

3. **Configure a URL do servidor** (se necessário):
   
   Edite o arquivo `services/socket.ts`:
   ```typescript
   const URL = 'http://localhost:3001'; // Ou o IP do seu servidor
   ```

---

## 📁 Estrutura do Projeto

```
client/
├── components/
│   ├── Button.tsx            # Componente de botão reutilizável
│   ├── Game.tsx              # Componente principal do jogo
│   ├── Input.tsx             # Componente de input reutilizável
│   └── Lobby.tsx             # Componente do lobby (lista de salas)
├── public/
│   └── background-music.mp3  # Musica de fundo em loop
├── services/
│   └── socket.ts             # Configuração e instância do Socket.IO
├── App.tsx                   # Componente raiz da aplicação
├── index.tsx                 # Ponto de entrada (ReactDOM)
├── index.html                # HTML base
├── types.ts                  # Definições de tipos TypeScript
├── vite.config.ts            # Configuração do Vite
├── tsconfig.json             # Configuração TypeScript
└── package.json              # Dependências e scripts
```

---

## 🧩 Componentes

### App.tsx

**Responsabilidades**:
- Gerenciar estado global da aplicação
- Controlar transição entre LOBBY e GAME
- Estabelecer conexão Socket.IO na inicialização
- Escutar eventos globais (`room_joined`, `left_room_confirmed`)

**Estado**:
```typescript
const [state, setState] = useState<AppState>(AppState.LOBBY);
const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
const [nickname, setNickname] = useState('');
```

**Fluxo**:
1. Conecta ao socket ao montar
2. Escuta `room_joined` → muda para estado GAME
3. Escuta `left_room_confirmed` → volta para LOBBY
4. Desconecta ao desmontar

---

### Lobby.tsx

**Responsabilidades**:
- Exibir lista de salas disponíveis
- Permitir criação de nova sala
- Permitir entrada em sala existente
- Gerenciar nickname do jogador

**Eventos Socket.IO**:
- **Emite**: `list_rooms`, `create_room`, `join_room`
- **Escuta**: `room_list`

**Fluxo**:
1. Ao montar, solicita lista de salas
2. Escuta atualizações da lista
3. Ao criar sala, emite evento e aguarda `room_joined` (tratado no App)
4. Ao entrar em sala, emite evento e aguarda `room_joined`

---

### Game.tsx

**Responsabilidades**:
- Renderizar tabuleiro do jogo
- Gerenciar movimentos do jogador
- Exibir estado do jogo (turno, vencedor)
- Sistema de chat em tempo real
- Permitir saída da sala

**Props**:
```typescript
interface GameProps {
    initialRoom: Room;      // Sala inicial recebida
    myPlayerId: string;     // ID do socket do jogador atual
    onLeave: () => void;    // Callback ao sair
}
```

**Estado**:
```typescript
const [room, setRoom] = useState<Room>(initialRoom);
const [message, setMessage] = useState('');
const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
```

**Eventos Socket.IO**:
- **Emite**: `make_move`, `send_message`, `leave_room`
- **Escuta**: `room_update`, `chat_message`, `game_over`

**Lógica de Movimento**:
```typescript
const handleSquareClick = (index: number) => {
    // Validações:
    // 1. Posição não está ocupada
    // 2. Jogo não terminou
    // 3. Há 2 jogadores
    // 4. É o turno do jogador atual
    
    socket.emit('make_move', {roomId: room.id, index});
};
```

**Sistema de Chat**:
- Mensagens são codificadas em Base64 antes de enviar
- Mensagens recebidas são decodificadas para exibição
- Histórico mantido em estado local
- Auto-scroll para última mensagem

---

## 🔌 API de Eventos Socket.IO (Cliente)

### Eventos Emitidos pelo Cliente (Client → Server)

#### `list_rooms`
Solicita lista atualizada de salas disponíveis.

**Payload**: Nenhum

**Quando usar**: Ao entrar no lobby ou atualizar a lista

**Exemplo**:
```typescript
socket.emit('list_rooms');
```

---

#### `create_room`
Cria uma nova sala de jogo.

**Payload**:
```typescript
{
  roomName: string;    // Nome da sala
  nickname: string;    // Apelido do criador
}
```

**Resposta esperada**: Evento `room_joined`

**Exemplo**:
```typescript
socket.emit('create_room', {
  roomName: 'Minha Sala',
  nickname: 'Jogador1'
});
```

---

#### `join_room`
Entra em uma sala existente.

**Payload**:
```typescript
{
  roomId: string;      // ID da sala
  nickname: string;    // Apelido do jogador
}
```

**Resposta esperada**: Evento `room_joined`

**Exemplo**:
```typescript
socket.emit('join_room', {
  roomId: 'room_1234567890_abc123',
  nickname: 'Jogador2'
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

**Validações no cliente**:
- Posição não ocupada
- Jogo não terminou
- Há 2 jogadores
- É o turno do jogador

**Resposta esperada**: Evento `room_update`

**Exemplo**:
```typescript
socket.emit('make_move', {
  roomId: room.id,
  index: 4  // Posição central
});
```

---

#### `send_message`
Envia mensagem no chat da sala.

**Payload**:
```typescript
{
  roomId: string;      // ID da sala
  text: string;        // Mensagem codificada em Base64
}
```

**Processamento**:
```typescript
// Codificação antes de enviar
const encodedMessage = btoa(message);
socket.emit('send_message', {
  roomId: room.id,
  text: encodedMessage
});
```

**Resposta esperada**: Evento `chat_message`

---

#### `leave_room`
Sai da sala atual.

**Payload**: Nenhum (ou `{roomId: string}` dependendo da implementação)

**Resposta esperada**: Evento `left_room_confirmed`

**Exemplo**:
```typescript
socket.emit('leave_room');
```

---

### Eventos Recebidos pelo Cliente (Server → Client)

#### `room_list`
Lista atualizada de salas disponíveis.

**Payload**:
```typescript
Array<{
  id: string;
  name: string;
  playerCount: number;
  status: 'Waiting' | 'Playing' | 'Finished';
}>
```

**Uso**: Atualizar lista no componente `Lobby`

**Exemplo de handler**:
```typescript
socket.on('room_list', (rooms: RoomSummary[]) => {
  setRooms(rooms);
});
```

---

#### `room_joined`
Confirmação de entrada em uma sala.

**Payload**: Objeto `Room` completo

**Uso**: Mudar estado da aplicação para GAME

**Exemplo de handler**:
```typescript
socket.on('room_joined', (room: Room) => {
  setCurrentRoom(room);
  setState(AppState.GAME);
});
```

---

#### `room_update`
Atualização do estado da sala.

**Payload**: Objeto `Room` completo com estado atualizado

**Uso**: Atualizar tabuleiro, turno, jogadores

**Exemplo de handler**:
```typescript
socket.on('room_update', (updatedRoom: Room) => {
  setRoom(updatedRoom);
});
```

---

#### `game_over`
Notificação de fim de jogo.

**Payload**:
```typescript
{
  winner: 'X' | 'O' | 'DRAW';
}
```

**Uso**: Exibir mensagem de vitória/empate

**Exemplo de handler**:
```typescript
socket.on('game_over', ({ winner }) => {
  console.log('Game Over! Winner:', winner);
  // Atualizar UI para mostrar resultado
});
```

---

#### `chat_message`
Mensagem recebida no chat.

**Payload**:
```typescript
{
  sender: string;          // Apelido do remetente ou 'System'
  text: string;            // Mensagem (Base64)
  timestamp: number;       // Timestamp Unix
  isSystem?: boolean;      // Se for mensagem do sistema
}
```

**Processamento**:
```typescript
socket.on('chat_message', (msg: ChatMessage) => {
  // Decodificar Base64
  const decodedMsg = {...msg};
  if (!msg.isSystem) {
    decodedMsg.text = atob(msg.text);
  }
  setChatHistory(prev => [...prev, decodedMsg]);
});
```

---

#### `error`
Erro ocorrido.

**Payload**: `string` com mensagem de erro

**Exemplos**:
- `"Room is full"`
- `"Room not found"`

**Exemplo de handler**:
```typescript
socket.on('error', (errorMessage: string) => {
  alert(errorMessage);
});
```

---

#### `left_room_confirmed`
Confirmação de saída da sala.

**Payload**: Nenhum

**Uso**: Voltar para o lobby

**Exemplo de handler**:
```typescript
socket.on('left_room_confirmed', () => {
  setCurrentRoom(null);
  setState(AppState.LOBBY);
});
```

---

## 🧠 Teoria: Cliente WebSocket e React

### Integração Socket.IO com React

A integração de Socket.IO com React requer atenção especial devido ao ciclo de vida dos componentes e ao modo Strict Mode do React.

#### Problema: Duplicação de Listeners

No React 18 Strict Mode, componentes são montados duas vezes em desenvolvimento, o que pode causar listeners duplicados:

```typescript
// ❌ PROBLEMA: Listener duplicado
useEffect(() => {
  socket.on('room_update', handleUpdate);
  // No Strict Mode, isso executa duas vezes!
}, []);
```

#### Solução: Cleanup de Listeners

Sempre remova listeners ao desmontar:

```typescript
// ✅ CORRETO: Remove listener ao desmontar
useEffect(() => {
  socket.on('room_update', handleUpdate);
  
  return () => {
    socket.off('room_update', handleUpdate);
  };
}, []);
```

#### Helper para Setup de Listeners

O arquivo `services/socket.ts` fornece um helper:

```typescript
export const setupSocketListeners = (
  socket: Socket, 
  listeners: Record<string, (data: any) => void>
) => {
  Object.entries(listeners).forEach(([event, handler]) => {
    socket.off(event);  // Remove listener existente
    socket.on(event, handler);  // Adiciona novo listener
  });
};
```

**Uso**:
```typescript
useEffect(() => {
  setupSocketListeners(socket, {
    'room_update': handleRoomUpdate,
    'chat_message': handleChatMessage,
    'game_over': handleGameOver
  });
  
  return () => {
    // Cleanup manual se necessário
  };
}, []);
```

### Gerenciamento de Estado com Hooks

#### useState para Estado Local

Cada componente gerencia seu próprio estado:

```typescript
// Estado do jogo
const [room, setRoom] = useState<Room>(initialRoom);

// Estado do chat
const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);

// Estado do formulário
const [message, setMessage] = useState('');
```

#### useEffect para Side Effects

Use `useEffect` para:
- Conectar ao socket
- Escutar eventos
- Atualizar estado baseado em eventos
- Cleanup ao desmontar

```typescript
useEffect(() => {
  // Setup
  socket.on('room_update', handleUpdate);
  
  // Cleanup
  return () => {
    socket.off('room_update', handleUpdate);
  };
}, []); // Array vazio = executa apenas ao montar/desmontar
```

#### useRef para Referências

Use `useRef` para valores que não causam re-render:

```typescript
// Referência para elemento do DOM (auto-scroll do chat)
const chatEndRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  chatEndRef.current?.scrollIntoView({behavior: 'smooth'});
}, [chatHistory]);
```

### Padrão de Comunicação Cliente-Servidor

#### 1. Conexão Inicial

```typescript
// Cliente conecta
socket.connect();

// Escuta evento de conexão
socket.on('connect', () => {
  console.log('Conectado:', socket.id);
});
```

#### 2. Emitir Evento e Aguardar Resposta

```typescript
// Emitir evento
socket.emit('create_room', { roomName, nickname });

// Escutar resposta
socket.on('room_joined', (room) => {
  // Processar resposta
  setCurrentRoom(room);
});
```

#### 3. Escutar Atualizações em Tempo Real

```typescript
// Escutar atualizações contínuas
socket.on('room_update', (updatedRoom) => {
  setRoom(updatedRoom);
});
```

### Ciclo de Vida da Conexão

```
1. Componente monta
   ↓
2. useEffect executa
   ↓
3. socket.connect() chamado
   ↓
4. Handshake WebSocket estabelecido
   ↓
5. Listeners registrados
   ↓
6. Componente renderiza
   ↓
7. Usuário interage → socket.emit()
   ↓
8. Servidor responde → socket.on() handler executa
   ↓
9. Estado atualizado → Re-render
   ↓
10. Componente desmonta
   ↓
11. Cleanup executa → socket.off() e socket.disconnect()
```

### Otimizações e Boas Práticas

#### 1. Evitar Re-renders Desnecessários

```typescript
// ❌ PROBLEMA: Cria nova função a cada render
socket.on('room_update', (room) => {
  setRoom(room);
});

// ✅ MELHOR: Função estável com useCallback
const handleRoomUpdate = useCallback((room: Room) => {
  setRoom(room);
}, []);

useEffect(() => {
  socket.on('room_update', handleRoomUpdate);
  return () => socket.off('room_update', handleRoomUpdate);
}, [handleRoomUpdate]);
```

#### 2. Debounce para Eventos Frequentes

```typescript
import { debounce } from 'lodash';

const debouncedRoomListUpdate = debounce((rooms: RoomSummary[]) => {
  setRooms(rooms);
}, 300);

socket.on('room_list', debouncedRoomListUpdate);
```

#### 3. Memoização de Componentes Pesados

```typescript
const GameBoard = React.memo(({ board, onSquareClick }) => {
  // Componente só re-renderiza se props mudarem
  return (
    <div className="grid grid-cols-3">
      {board.map((cell, idx) => (
        <Square key={idx} value={cell} onClick={() => onSquareClick(idx)} />
      ))}
    </div>
  );
});
```

---

## 🏗️ Arquitetura do Cliente

### Fluxo de Dados

```
┌──────────────┐
│   Usuário    │
└──────┬───────┘
       │ Interage (clique, input)
       │
┌──────▼──────────────────────────────────────┐
│         Componente React                    │
│  • Captura evento do usuário                │
│  • Valida dados                             │
│  • Atualiza estado local (opcional)         │
└──────┬──────────────────────────────────────┘
       │ socket.emit('evento', dados)
       │
┌──────▼──────────────────────────────────────┐
│      Socket.IO Client                       │
│  • Serializa dados                          │
│  • Envia via WebSocket                      │
└──────┬──────────────────────────────────────┘
       │ WebSocket Frame
       │
┌──────▼──────────────────────────────────────┐
│         Servidor                            │
│  • Processa evento                          │
│  • Atualiza estado                          │
│  • Emite resposta/broadcast                 │
└──────┬──────────────────────────────────────┘
       │ WebSocket Frame
       │
┌──────▼──────────────────────────────────────┐
│      Socket.IO Client                       │
│  • Recebe dados                             │
│  • Deserializa                              │
└──────┬──────────────────────────────────────┘
       │ socket.on('evento', handler)
       │
┌──────▼──────────────────────────────────────┐
│         Componente React                    │
│  • Handler executa                          │
│  • setState() atualiza estado               │
│  • Componente re-renderiza                  │
└──────┬──────────────────────────────────────┘
       │
┌──────▼───────┐
│   Usuário    │
│  Vê mudança  │
└──────────────┘
```

---

## 🔄 Fluxo de Dados no Cliente

### 1. Inicialização da Aplicação

```
1. index.tsx renderiza <App />
   ↓
2. App.tsx monta
   ↓
3. useEffect executa:
   - socket.connect()
   - Registra listeners globais
   ↓
4. Estado inicial: LOBBY
   ↓
5. Renderiza <Lobby />
```

### 2. Criação de Sala

```
1. Usuário preenche nickname e nome da sala
   ↓
2. Submit do formulário
   ↓
3. Lobby.tsx: handleCreateRoom()
   ↓
4. socket.emit('create_room', {roomName, nickname})
   ↓
5. Servidor processa e cria sala
   ↓
6. Servidor emite 'room_joined' para criador
   ↓
7. App.tsx: handler recebe 'room_joined'
   ↓
8. setCurrentRoom(room)
   setState(AppState.GAME)
   ↓
9. Renderiza <Game />
```

### 3. Movimento no Jogo

```
1. Usuário clica em quadrado
   ↓
2. Game.tsx: handleSquareClick(index)
   ↓
3. Validações locais:
   - Posição vazia?
   - É meu turno?
   - Jogo não terminou?
   ↓
4. socket.emit('make_move', {roomId, index})
   ↓
5. Servidor valida e processa
   ↓
6. Servidor atualiza estado da sala
   ↓
7. Servidor emite 'room_update' para sala
   ↓
8. Game.tsx: handler recebe 'room_update'
   ↓
9. setRoom(updatedRoom)
   ↓
10. Componente re-renderiza com novo estado
```

### 4. Chat

```
1. Usuário digita mensagem
   ↓
2. Submit do formulário
   ↓
3. Game.tsx: handleSendMessage()
   ↓
4. Codifica em Base64: btoa(message)
   ↓
5. socket.emit('send_message', {roomId, text: encoded})
   ↓
6. Servidor recebe e faz broadcast para sala
   ↓
7. Game.tsx: handler recebe 'chat_message'
   ↓
8. Decodifica: atob(msg.text)
   ↓
9. setChatHistory(prev => [...prev, decodedMsg])
   ↓
10. Auto-scroll para última mensagem
```

### 5. Saída da Sala

```
1. Usuário clica "Leave Room"
   ↓
2. Game.tsx: handleLeave()
   ↓
3. socket.emit('leave_room')
   ↓
4. Servidor remove jogador da sala
   ↓
5. Servidor emite 'left_room_confirmed'
   ↓
6. App.tsx: handler recebe 'left_room_confirmed'
   ↓
7. setCurrentRoom(null)
   setState(AppState.LOBBY)
   ↓
8. Renderiza <Lobby />
```

---

## 📊 Gerenciamento de Estado

### Hierarquia de Estado

```
App.tsx (Estado Global)
├── state: AppState (LOBBY | GAME)
├── currentRoom: Room | null
└── nickname: string
    │
    ├── Lobby.tsx (Estado Local)
    │   ├── rooms: RoomSummary[]
    │   └── newRoomName: string
    │
    └── Game.tsx (Estado Local)
        ├── room: Room
        ├── message: string
        └── chatHistory: ChatMessage[]
```

### Quando Usar Estado Local vs Global

**Estado Global (App.tsx)**:
- Estado da aplicação (LOBBY/GAME)
- Sala atual (necessário para transição entre componentes)
- Nickname (compartilhado entre Lobby e Game)

**Estado Local (Componentes)**:
- Estado específico do componente
- Dados temporários de formulários
- Histórico de chat (não precisa ser compartilhado)

### Sincronização com Servidor

O estado local é sincronizado com o servidor através de eventos Socket.IO:

```typescript
// Estado local
const [room, setRoom] = useState<Room>(initialRoom);

// Sincronização via eventos
useEffect(() => {
  const handleUpdate = (updatedRoom: Room) => {
    setRoom(updatedRoom); // Atualiza estado local
  };
  
  socket.on('room_update', handleUpdate);
  return () => socket.off('room_update', handleUpdate);
}, []);
```

---

## 📝 Exemplos de Uso

### Exemplo 1: Conectar e Listar Salas

```typescript
import { socket } from './services/socket';
import { useEffect, useState } from 'react';

function RoomList() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    // Conectar
    socket.connect();

    // Solicitar lista
    socket.emit('list_rooms');

    // Escutar atualizações
    const handleRoomList = (data) => {
      setRooms(data);
    };

    socket.on('room_list', handleRoomList);

    return () => {
      socket.off('room_list', handleRoomList);
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      {rooms.map(room => (
        <div key={room.id}>{room.name}</div>
      ))}
    </div>
  );
}
```

### Exemplo 2: Criar e Entrar em Sala

```typescript
function CreateRoom() {
  const [nickname, setNickname] = useState('');
  const [roomName, setRoomName] = useState('');

  const handleCreate = () => {
    socket.emit('create_room', {
      roomName,
      nickname
    });
  };

  // Escutar confirmação
  useEffect(() => {
    const handleJoined = (room) => {
      console.log('Entrei na sala:', room);
      // Navegar para tela de jogo
    };

    socket.on('room_joined', handleJoined);
    return () => socket.off('room_joined', handleJoined);
  }, []);

  return (
    <form onSubmit={(e) => { e.preventDefault(); handleCreate(); }}>
      <input 
        value={nickname} 
        onChange={(e) => setNickname(e.target.value)}
        placeholder="Seu nome"
      />
      <input 
        value={roomName} 
        onChange={(e) => setRoomName(e.target.value)}
        placeholder="Nome da sala"
      />
      <button type="submit">Criar</button>
    </form>
  );
}
```

### Exemplo 3: Fazer Movimento

```typescript
function GameBoard({ room, myPlayerId }) {
  const handleMove = (index: number) => {
    // Validações
    if (room.board[index]) return; // Posição ocupada
    if (room.winner) return; // Jogo terminou
    if (room.players.length < 2) return; // Aguardando oponente
    
    const myPlayer = room.players.find(p => p.id === myPlayerId);
    if (myPlayer?.symbol !== room.turn) return; // Não é meu turno

    // Enviar movimento
    socket.emit('make_move', {
      roomId: room.id,
      index
    });
  };

  // Escutar atualizações
  useEffect(() => {
    const handleUpdate = (updatedRoom) => {
      // Estado será atualizado pelo componente pai
      console.log('Sala atualizada:', updatedRoom);
    };

    socket.on('room_update', handleUpdate);
    return () => socket.off('room_update', handleUpdate);
  }, []);

  return (
    <div className="grid grid-cols-3">
      {room.board.map((cell, idx) => (
        <button
          key={idx}
          onClick={() => handleMove(idx)}
          disabled={!!cell || !!room.winner}
        >
          {cell || ' '}
        </button>
      ))}
    </div>
  );
}
```

### Exemplo 4: Sistema de Chat

```typescript
function Chat({ room }) {
  const [message, setMessage] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const handleMessage = (msg) => {
      // Decodificar Base64
      const decoded = {
        ...msg,
        text: msg.isSystem ? msg.text : atob(msg.text)
      };
      setHistory(prev => [...prev, decoded]);
    };

    socket.on('chat_message', handleMessage);
    return () => socket.off('chat_message', handleMessage);
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Codificar em Base64
    const encoded = btoa(message);
    socket.emit('send_message', {
      roomId: room.id,
      text: encoded
    });
    setMessage('');
  };

  return (
    <div>
      <div className="chat-history">
        {history.map((msg, i) => (
          <div key={i}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage}>
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Digite sua mensagem..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
```

### Exemplo 5: Tratamento de Erros

```typescript
function Game() {
  useEffect(() => {
    const handleError = (errorMessage: string) => {
      // Exibir erro ao usuário
      alert(`Erro: ${errorMessage}`);
      
      // Ações específicas por tipo de erro
      if (errorMessage === 'Room is full') {
        // Voltar para lobby
      } else if (errorMessage === 'Room not found') {
        // Atualizar lista de salas
      }
    };

    socket.on('error', handleError);
    return () => socket.off('error', handleError);
  }, []);

  // ...
}
```

### Exemplo 6: Indicadores de Conexão

```typescript
function ConnectionStatus() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const handleConnect = () => {
      setConnected(true);
      console.log('Conectado ao servidor');
    };

    const handleDisconnect = () => {
      setConnected(false);
      console.log('Desconectado do servidor');
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    return () => {
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
    };
  }, []);

  return (
    <div className={`status ${connected ? 'online' : 'offline'}`}>
      {connected ? '🟢 Conectado' : '🔴 Desconectado'}
    </div>
  );
}
```

---

## 🎨 Estilização

O projeto utiliza **Tailwind CSS** via CDN para estilização. As cores customizadas estão definidas em `index.html`:

```javascript
colors: {
  neon: {
    blue: '#00f3ff',
    pink: '#ff00ff',
    purple: '#bc13fe',
    dark: '#0f172a'
  }
}
```

### Classes Customizadas

- `bg-neon-blue`: Fundo azul neon
- `text-neon-pink`: Texto rosa neon
- `border-slate-700`: Borda cinza escuro
- `backdrop-blur-xl`: Efeito de blur no fundo

---

## 🐛 Troubleshooting

### Problema: Socket não conecta

**Solução**: Verifique a URL do servidor em `services/socket.ts`:
```typescript
const URL = 'http://localhost:3001'; // Certifique-se que está correto
```

### Problema: Listeners duplicados

**Solução**: Sempre faça cleanup de listeners:
```typescript
useEffect(() => {
  socket.on('event', handler);
  return () => socket.off('event', handler);
}, []);
```

### Problema: Estado não atualiza

**Solução**: Verifique se o handler está registrado corretamente e se o estado está sendo atualizado:
```typescript
socket.on('room_update', (room) => {
  setRoom(room); // Certifique-se de chamar setState
});
```

### Problema: Mensagens de chat não aparecem

**Solução**: Verifique a decodificação Base64:
```typescript
const decoded = atob(msg.text); // Certifique-se de decodificar
```

---

## 📄 Licença

Este projeto é parte de um trabalho acadêmico da UFES e é destinado exclusivamente para fins educacionais.

---

## 📚 Referências

- [React Documentation](https://react.dev/)
- [Socket.IO Client Documentation](https://socket.io/docs/v4/client-api/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

---