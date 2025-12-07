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

## 🎯 Principais Escolhas de Implementação

Durante o desenvolvimento deste projeto, várias decisões arquiteturais e técnicas foram tomadas para garantir uma implementação robusta e eficiente. Abaixo estão as principais escolhas:

### 1. **Socket.IO como Abstração sobre WebSockets**

Optamos por utilizar **Socket.IO** ao invés de WebSockets nativos devido a:
- **Fallback automático**: Se WebSockets não estiverem disponíveis, o sistema automaticamente usa polling HTTP
- **Reconexão automática**: Gerenciamento transparente de reconexões em caso de queda de conexão
- **Sistema de eventos nomeados**: Facilita a organização e manutenção do código
- **Rooms nativas**: Suporte integrado para agrupamento de clientes em salas

### 2. **Estado Gerenciado no Servidor (Single Source of Truth)**

Toda a lógica do jogo e estado das salas é mantida no servidor através de um `Map<string, Room>` em memória:
- **Validação centralizada**: Movimentos são validados no servidor antes de serem aplicados
- **Prevenção de trapaça**: Clientes não podem modificar o estado diretamente
- **Sincronização garantida**: Todos os clientes recebem o mesmo estado através de broadcasts
- **Consistência**: Impossível ter estados divergentes entre clientes

### 3. **Arquitetura Modular e Separação de Responsabilidades**

O código foi organizado em módulos específicos:
- **`gameLogic.ts`**: Contém apenas a lógica de verificação de vitória e empate
- **`roomManager.ts`**: Gerencia criação, atualização e remoção de salas
- **`socketHandlers.ts`**: Centraliza todos os handlers de eventos Socket.IO
- **`types.ts`**: Define todas as interfaces TypeScript compartilhadas

Esta separação facilita manutenção, testes e compreensão do código.

### 4. **TypeScript em Todo o Projeto**

TypeScript foi utilizado tanto no servidor quanto no cliente:
- **Type safety**: Prevenção de erros em tempo de compilação
- **Autocomplete**: Melhor experiência de desenvolvimento
- **Documentação implícita**: Tipos servem como documentação do código
- **Refatoração segura**: Mudanças podem ser feitas com confiança

### 5. **Sistema de Rooms do Socket.IO**

Utilizamos o conceito de **Rooms** para isolar comunicação por sala:
- Cada sala é um room separado no Socket.IO
- Broadcasting é feito apenas para jogadores na mesma sala
- Facilita gerenciamento de múltiplas partidas simultâneas
- Reduz overhead de comunicação (não precisa filtrar clientes manualmente)

### 6. **Validação de Movimentos no Servidor**

Todas as validações de movimentos são feitas no servidor:
- Verificação de turno correto
- Verificação de posição vazia
- Verificação de jogo não finalizado
- Prevenção de movimentos duplicados ou inválidos

### 7. **Tratamento de Desconexões com Vitória por W.O.**

Implementamos lógica específica para desconexões:
- Se um jogador desconectar durante uma partida ativa, o oponente vence automaticamente
- Mensagem de sistema informa sobre a desconexão
- Estado da sala é atualizado e broadcastado
- Salas vazias são automaticamente removidas

### 8. **React Hooks para Gerenciamento de Estado**

No frontend, utilizamos React Hooks modernos:
- **`useState`**: Para estado local dos componentes
- **`useEffect`**: Para side effects (conexão Socket.IO, listeners)
- **`useRef`**: Para referências DOM (scroll do chat)
- Abordagem funcional e declarativa

### 9. **Base64 para "Criptografia Visual" no Chat**

Mensagens do chat são codificadas em Base64 antes do envio:
- Demonstração conceitual de codificação (não é criptografia real)
- Mensagens aparecem codificadas na rede
- Decodificação automática no cliente
- Adiciona um elemento visual interessante ao projeto

### 10. **Design Cyberpunk com Tailwind CSS**

Interface moderna com tema cyberpunk:
- Cores neon (azul, rosa, roxo)
- Efeitos de sombra e brilho
- Design responsivo
- Feedback visual claro para ações do usuário

---

## 🚧 Desafios Enfrentados

Durante o desenvolvimento, enfrentamos diversos desafios técnicos e conceituais:

### 1. **Sincronização de Estado em Tempo Real**

**Desafio**: Garantir que todos os clientes vejam o mesmo estado do jogo simultaneamente.

**Solução**: Implementamos um modelo onde o servidor é a única fonte de verdade. Após cada movimento, o servidor valida, atualiza o estado e faz broadcast para todos os jogadores da sala usando `io.to(roomId).emit()`.

### 2. **Gerenciamento de Múltiplas Salas Simultâneas**

**Desafio**: Permitir que múltiplas partidas ocorram simultaneamente sem interferência entre elas.

**Solução**: Utilizamos o sistema de Rooms do Socket.IO, onde cada sala é um room isolado. O gerenciamento é feito através de um `Map<string, Room>` que mantém todas as salas ativas.

### 3. **Tratamento de Desconexões e Reconexões**

**Desafio**: Lidar com jogadores que desconectam durante uma partida ou que tentam reconectar.

**Solução**: Implementamos handlers específicos para eventos `disconnect` e `leave_room`. Quando um jogador desconecta durante uma partida ativa, o oponente vence por W.O. e o estado é atualizado. Salas vazias são automaticamente removidas.

### 4. **Validação de Movimentos e Prevenção de Trapaça**

**Desafio**: Garantir que jogadores não possam fazer movimentos inválidos ou trapacear.

**Solução**: Toda validação é feita no servidor antes de aplicar qualquer mudança:
- Verificação se é o turno do jogador
- Verificação se a posição está vazia
- Verificação se o jogo não terminou
- Verificação se o jogador está na sala correta

### 5. **Coordenação de Eventos Socket.IO com React**

**Desafio**: Gerenciar listeners de eventos Socket.IO que precisam ser registrados e removidos corretamente para evitar memory leaks.

**Solução**: Utilizamos `useEffect` com cleanup functions que removem listeners quando componentes são desmontados. Também garantimos que listeners sejam registrados apenas uma vez.

### 6. **Atualização da Lista de Salas em Tempo Real**

**Desafio**: Manter a lista de salas no lobby sempre atualizada quando salas são criadas, preenchidas ou finalizadas.

**Solução**: Implementamos broadcasts globais (`io.emit()`) sempre que o estado das salas muda, garantindo que todos os clientes no lobby recebam atualizações imediatas.

### 7. **Interface Responsiva e Feedback Visual**

**Desafio**: Criar uma interface que seja responsiva e forneça feedback claro sobre o estado do jogo.

**Solução**: Utilizamos Tailwind CSS com design mobile-first, cores e animações que indicam claramente o estado atual (vez do jogador, jogo finalizado, etc.).

### 8. **Type Safety entre Cliente e Servidor**

**Desafio**: Garantir que os tipos TypeScript sejam consistentes entre cliente e servidor.

**Solução**: Criamos arquivos `types.ts` separados em cliente e servidor com interfaces compatíveis. Em um projeto maior, seria ideal ter um pacote compartilhado de tipos.

---

## 🔮 Melhorias Futuras

Este projeto foi desenvolvido como forma de praticar a teoria aprendida em sala, mas há várias melhorias que poderiam ser implementadas para torná-lo mais robusto e completo:

### 1. **Sistema de Reinício de Jogo na Mesma Sala**

**Limitação Atual**: Após um jogo ser finalizado, não é possível iniciar uma nova partida na mesma sala. Os jogadores precisam sair e criar/entrar em uma nova sala.

**Melhoria Proposta**:
- Adicionar botão "Jogar Novamente" após o fim do jogo
- Implementar evento `restart_game` que reseta o tabuleiro e alterna os símbolos dos jogadores
- Manter os mesmos jogadores na sala e permitir múltiplas partidas consecutivas

### 2. **Persistência de Dados**

**Limitação Atual**: Todo o estado é mantido em memória. Se o servidor reiniciar, todas as salas e partidas são perdidas.

**Melhorias Propostas**:
- Integração com banco de dados (PostgreSQL, MongoDB, ou Redis)
- Persistência de histórico de partidas
- Salvar estado de partidas em andamento para recuperação após reinício
- Sistema de backup automático

### 3. **Sistema de Autenticação e Perfis de Usuário**

**Melhoria Proposta**:
- Autenticação via JWT ou OAuth
- Perfis de usuário com estatísticas (vitórias, derrotas, empates)
- Sistema de ranking/elo
- Histórico pessoal de partidas

### 4. **Sistema de Temporizador para Jogadas**

**Melhoria Proposta**:
- Timer por jogada (ex: 30 segundos)
- Vitória automática se o tempo esgotar
- Indicador visual de tempo restante
- Opção de configurar tempo por partida

### 5. **Sistema de Espectadores**

**Melhoria Proposta**:
- Permitir que usuários assistam partidas sem participar
- Chat separado para espectadores
- Limite de espectadores por sala
- Modo "observador" que não interfere no jogo

### 6. **Melhorias no Sistema de Chat**

**Melhorias Propostas**:
- Criptografia real (end-to-end encryption)
- Histórico de mensagens persistido
- Emojis e formatação de texto
- Comandos especiais (/help, /stats, etc.)
- Filtro de palavras ofensivas

### 7. **Sistema de Notificações**

**Melhoria Proposta**:
- Notificações quando um oponente faz uma jogada
- Notificações quando alguém entra na sua sala
- Notificações de convites para partidas
- Notificações push (se implementado como PWA)

### 8. **Modos de Jogo Adicionais**

**Melhorias Propostas**:
- Jogo da velha 4x4 ou 5x5
- Modo torneio
- Modo contra IA (bot)
- Modo cooperativo ou por equipes

### 9. **Otimizações de Performance**

**Melhorias Propostas**:
- Compressão de mensagens WebSocket
- Rate limiting para prevenir spam
- Connection pooling
- Cache de estados frequentes
- Load balancing para múltiplos servidores

### 10. **Melhorias na Interface do Usuário**

**Melhorias Propostas**:
- Animações mais suaves para movimentos
- Efeitos sonoros para jogadas e vitórias
- Temas personalizáveis (além do cyberpunk)
- Modo escuro/claro
- Acessibilidade (suporte a leitores de tela, navegação por teclado)

### 11. **Sistema de Logs e Monitoramento**

**Melhoria Proposta**:
- Logs estruturados de eventos
- Dashboard de monitoramento (salas ativas, jogadores online)
- Métricas de performance
- Alertas para problemas no servidor

### 12. **Testes Automatizados**

**Melhoria Proposta**:
- Testes unitários para lógica do jogo
- Testes de integração para Socket.IO
- Testes end-to-end para fluxos completos
- CI/CD pipeline

### 13. **Documentação de API**

**Melhoria Proposta**:
- Documentação OpenAPI/Swagger para eventos Socket.IO
- Exemplos de integração
- Guia de contribuição
- Documentação de arquitetura detalhada

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

