# 🎮 Jogo da Velha Multiplayer

Sistema de um jogo da velha multiplayer em tempo real desenvolvido com **React**, **Node.js**, **TypeScript** e **Socket.IO**. Este projeto demonstra comunicação em tempo real utilizando WebSockets, implementando um jogo multiplayer com sistema de salas, chat e sincronização de estado.

---

## 👥 Autores

Desenvolvido para o curso de **Redes de Computadores** - **UFES**.

Athila Archanji Rodrigues

Bernardo Vargens Broedel

---

## 📋 Índice

- [Visão Geral](#-visão-geral)
- [Características](#-características)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Requisitos](#-requisitos)
- [Instalação Completa](#-instalação-completa)
- [Como Executar](#-como-executar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Fluxo de Comunicação](#-fluxo-de-comunicação)
- [Documentação Detalhada](#-documentação-detalhada)
- [Teoria: WebSockets e Comunicação em Tempo Real](#-teoria-websockets-e-comunicação-em-tempo-real)

---

## 🎯 Visão Geral

Este projeto é um **sistema completo de jogo da velha multiplayer** que permite múltiplos jogadores criarem salas, jogarem em tempo real e comunicarem-se via chat. O sistema é composto por duas partes principais:

1. **Servidor (Backend)**: Node.js/TypeScript com Socket.IO que gerencia salas, sincroniza movimentos e coordena a comunicação entre clientes.

2. **Cliente (Frontend)**: Aplicação React/TypeScript com interface moderna estilo cyberpunk que permite aos usuários interagirem com o jogo.

### Objetivo do Projeto

Demonstrar e implementar conceitos de **comunicação em tempo real** utilizando WebSockets, explorando:
- Protocolo WebSocket e suas vantagens sobre HTTP tradicional
- Comunicação bidirecional cliente-servidor
- Sincronização de estado em tempo real
- Gerenciamento de múltiplas conexões simultâneas
- Broadcasting e rooms (salas) em Socket.IO

---

## ✨ Características

### Funcionalidades Principais

- ✅ **Jogo da Velha Multiplayer**: Suporte para múltiplas salas simultâneas
- ✅ **Tempo Real**: Comunicação bidirecional instantânea via WebSockets
- ✅ **Sistema de Salas**: Criação e gerenciamento dinâmico de salas de jogo
- ✅ **Chat em Tempo Real**: Sistema de mensagens entre jogadores com "criptografia visual" (Base64)
- ✅ **Tratamento de Desconexões**: Lógica de vitória por W.O. quando jogador desconecta
- ✅ **Interface Moderna**: Design cyberpunk com efeitos neon
- ✅ **TypeScript**: Código totalmente tipado em servidor e cliente
- ✅ **Arquitetura Modular**: Código organizado e separado por responsabilidades

### Recursos Técnicos

- **Comunicação WebSocket**: Protocolo full-duplex para comunicação em tempo real
- **Socket.IO**: Biblioteca que abstrai WebSockets com fallback automático
- **React Hooks**: Gerenciamento moderno de estado e side effects
- **TypeScript**: Type safety em todo o projeto
- **Vite**: Build tool rápido para desenvolvimento frontend
- **Express**: Framework web para o servidor HTTP

---

## 🏗️ Arquitetura do Sistema

### Componentes do Sistema

#### 1. Cliente (Frontend)
- **Tecnologia**: React 18 + TypeScript
- **Build Tool**: Vite
- **Estilização**: Tailwind CSS
- **Comunicação**: Socket.IO Client
- **Porta**: 5173 (desenvolvimento)

#### 2. Servidor (Backend)
- **Tecnologia**: Node.js + TypeScript
- **Framework**: Express
- **Comunicação**: Socket.IO Server
- **Porta**: 3001

### Fluxo de Dados

```
1. Cliente conecta ao servidor via WebSocket
   ↓
2. Cliente solicita lista de salas
   ↓
3. Servidor retorna lista atualizada
   ↓
4. Cliente cria/entra em sala
   ↓
5. Servidor gerencia estado da sala
   ↓
6. Jogadores fazem movimentos
   ↓
7. Servidor valida e sincroniza estado
   ↓
8. Broadcast para todos na sala
   ↓
9. Clientes atualizam interface em tempo real
```

---

## 🛠️ Tecnologias Utilizadas

### Frontend (Cliente)

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | ^18.2.0 | Biblioteca UI |
| TypeScript | ^5.2.2 | Type safety |
| Vite | ^5.0.8 | Build tool e dev server |
| Socket.IO Client | ^4.7.2 | Cliente WebSocket |
| Tailwind CSS | CDN | Framework CSS |

### Backend (Servidor)

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| Node.js | >=18.x | Runtime JavaScript |
| TypeScript | ^5.3.2 | Type safety |
| Express | ^4.18.2 | Framework HTTP |
| Socket.IO | ^4.7.2 | Servidor WebSocket |
| CORS | ^2.8.5 | Cross-Origin Resource Sharing |
| tsx | ^4.6.2 | TypeScript executor |

---

## 📦 Requisitos

### Software Necessário

- **Node.js** >= 18.x
- **npm** >= 9.x (ou yarn/pnpm)
- **Navegador** (Chrome, Firefox, Edge, Safari)

### Requisitos de Sistema

- **RAM**: Mínimo 4GB (recomendado 8GB)
- **Espaço em disco**: ~500MB (incluindo node_modules)
- **Conexão de rede**: Para comunicação entre cliente e servidor

---

## 🚀 Instalação Completa

### Passo 1: Clone ou Baixe o Projeto


### Passo 2: Instale as Dependências do Servidor

```bash
cd server
npm install
```

### Passo 3: Instale as Dependências do Cliente

```bash
cd ../client
npm install
```

### Passo 4: Configure a URL do Servidor (Opcional)

Se o servidor não estiver rodando em `localhost:3001`, edite `client/services/socket.ts`:

```typescript
const URL = 'http://SEU_IP_AQUI:3001';
// Exemplo: 'http://192.168.0.55:3001'
```

---

## 💻 Como Executar

#### Terminal 1 - Servidor

```bash
cd server
npm run dev
```

Você verá:
```
Server running on http://localhost:3001
```

#### Terminal 2 - Cliente

```bash
cd client
npm run dev
```

Você verá:
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```
---

## 📁 Estrutura do Projeto

```
v2/
├── client/                         # Aplicação React (Frontend)
│   ├── components/                 # Componentes React
│   │   ├── Button.tsx              # Componente de botão
│   │   ├── Game.tsx                # Componente do jogo
│   │   ├── Input.tsx               # Componente de input
│   │   └── Lobby.tsx               # Componente do lobby
│   ├── services/                   # Serviços
│   │   └── socket.ts               # Configuração Socket.IO
│   ├── App.tsx                     # Componente raiz
│   ├── index.tsx                   # Ponto de entrada
│   ├── index.html                  # HTML base
│   ├── types.ts                    # Tipos TypeScript
│   ├── vite.config.ts              # Configuração Vite
│   ├── tsconfig.json               # Configuração TypeScript
│   ├── package.json                # Dependências do cliente
│   └── README.md                   # Documentação do cliente
│
├── server/                         # Servidor Node.js (Backend)
│   ├── src/                        # Código fonte
│   │   ├── types.ts                # Interfaces TypeScript
│   │   ├── gameLogic.ts            # Lógica do jogo
│   │   ├── roomManager.ts          # Gerenciamento de salas
│   │   ├── socketHandlers.ts       # Handlers Socket.IO
│   │   └── server.ts               # Arquivo principal
│   ├── package.json                # Dependências do servidor
│   ├── tsconfig.json               # Configuração TypeScript
│   └── README.md                   # Documentação do servidor
│
└── README.md                       # Este arquivo (documentação geral)
```

---

## 🔄 Fluxo de Comunicação

### Sequência Completa de uma Partida

```
┌──────────┐                    ┌──────────┐                    ┌──────────┐
│ Cliente1 │                    │ Servidor │                    │ Cliente2 │
└────┬─────┘                    └────┬─────┘                    └────┬─────┘
     │                               │                               │
     │─── connect() ────────────────>│                               │
     │<── connection established ────│                               │
     │                               │                               │
     │─── emit('list_rooms') ───────>│                               │
     │<── emit('room_list') ─────────│                               │
     │                               │                               │
     │─── emit('create_room') ──────>│                               │
     │                               │ [Cria sala]                   │
     │<── emit('room_joined') ───────│                               │
     │                               │                               │
     │                               │<── connect() ─────────────────│
     │                               │<── emit('list_rooms') ────────│
     │                               │─── emit('room_list') ────────>│
     │                               │                               │
     │                               │<── emit('join_room') ─────────│
     │                               │ [Adiciona Cliente2]           │
     │<── emit('room_update') ───────│─── emit('room_update') ──────>│
     │                               │                               │
     │─── emit('make_move') ────────>│                               │
     │                               │ [Valida e atualiza]           │
     │<── emit('room_update') ───────│─── emit('room_update') ──────>│
     │                               │                               │
     │─── emit('send_message') ─────>│                               │
     │                               │ [Broadcast]                   │
     │<── emit('chat_message') ──────│─── emit('chat_message') ─────>│
     │                               │                               │
     │─── emit('make_move') ────────>│                               │
     │                               │ [Verifica vencedor]           │
     │<── emit('game_over') ─────────│─── emit('game_over') ────────>│
     │                               │                               │
```

### Eventos Principais

#### Cliente → Servidor
- `list_rooms`: Solicita lista de salas
- `create_room`: Cria nova sala
- `join_room`: Entra em sala existente
- `make_move`: Realiza movimento
- `send_message`: Envia mensagem no chat
- `leave_room`: Sai da sala

#### Servidor → Cliente
- `room_list`: Lista atualizada de salas
- `room_joined`: Confirmação de entrada em sala
- `room_update`: Atualização do estado da sala
- `game_over`: Fim de jogo
- `chat_message`: Mensagem recebida
- `error`: Erro ocorrido

---

## 📚 Documentação Detalhada

Este projeto possui documentação completa e detalhada em cada módulo:

### 📖 Documentação do Servidor

Consulte [`server/README.md`](server/README.md) para:
- API completa de eventos Socket.IO
- Teoria sobre WebSockets e Socket.IO
- Arquitetura do servidor
- Gerenciamento de salas e estado
- Exemplos de uso do servidor

### 📖 Documentação do Cliente

Consulte [`client/README.md`](client/README.md) para:
- Componentes React e suas responsabilidades
- Integração Socket.IO com React
- Gerenciamento de estado com hooks
- Fluxo de dados no cliente
- Exemplos de uso do cliente

---

## 🧠 Teoria: WebSockets e Comunicação em Tempo Real

### O que são WebSockets?

**WebSockets** é um protocolo de comunicação que estabelece uma conexão **full-duplex** (bidirecional) e **persistente** entre cliente e servidor sobre uma única conexão TCP. Diferente do modelo HTTP tradicional (request/response), os WebSockets permitem que tanto o cliente quanto o servidor enviem dados a qualquer momento, sem necessidade de requisições.

### Por que WebSockets?

#### Limitações do HTTP Tradicional

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

**Problemas**:
- ❌ Cliente sempre inicia a comunicação
- ❌ Conexão fechada após cada resposta
- ❌ Overhead de headers HTTP em cada requisição
- ❌ Não é eficiente para atualizações frequentes
- ❌ Requer polling para simular tempo real

#### Vantagens dos WebSockets

```
Cliente                     Servidor
   |                           |
   |--- WebSocket Handshake -->|
   |<-- Connection Established-|
   |                           |
   |<-- Event: room_update ----|  (Servidor pode enviar a qualquer momento)
   |                           |
   |--- Event: make_move ----->|  (Cliente pode enviar a qualquer momento)
   |                           |
   |<-- Event: room_update ----|
```

**Vantagens**:
- ✅ Comunicação bidirecional verdadeira
- ✅ Conexão persistente (menos overhead)
- ✅ Baixa latência
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

### Comparação: HTTP vs WebSocket

| Aspecto | HTTP | WebSocket |
|---------|------|-----------|
| **Direção** | Unidirecional (cliente → servidor) | Bidirecional |
| **Conexão** | Fechada após resposta | Persistente |
| **Overhead** | Headers em cada requisição | Apenas no handshake |
| **Latência** | Alta (nova conexão a cada vez) | Baixa (conexão persistente) |
| **Uso ideal** | APIs REST, páginas web | Chat, jogos, dashboards em tempo real |
| **Suporte servidor push** | Não (requer polling) | Sim (nativo) |

---

## 🎓 Contexto Acadêmico

Este projeto foi desenvolvido como parte do curso de **Redes de Computadores** da **Universidade Federal do Espírito Santo (UFES)**.

### Objetivos de Aprendizado

- Compreender protocolo WebSocket e suas aplicações
- Implementar comunicação em tempo real
- Gerenciar múltiplas conexões simultâneas
- Sincronizar estado entre múltiplos clientes
- Trabalhar com eventos e broadcasting
- Desenvolver aplicação full-stack moderna

### Conceitos Demonstrados

- ✅ Protocolo WebSocket (RFC 6455)
- ✅ Socket.IO e suas abstrações
- ✅ Comunicação cliente-servidor bidirecional
- ✅ Gerenciamento de estado distribuído
- ✅ Rooms e namespaces
- ✅ Broadcasting e multicast
- ✅ React Hooks e gerenciamento de estado
- ✅ TypeScript em projeto full-stack

---

## 📄 Licença

Este projeto é parte de um trabalho acadêmico da UFES e é destinado exclusivamente para fins educacionais.

---


## 🔗 Links Úteis

- [Documentação Socket.IO](https://socket.io/docs/v4/)
- [Documentação React](https://react.dev/)
- [Documentação TypeScript](https://www.typescriptlang.org/docs/)
- [Documentação Vite](https://vitejs.dev/)
- [WebSocket Protocol (RFC 6455)](https://tools.ietf.org/html/rfc6455)

---
