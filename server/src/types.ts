// --- Types (Mirroring Client for Logic) ---
export interface Player {
    id: string;
    symbol: 'X' | 'O';
    nickname: string;
}

export interface Room {
    id: string;
    name: string;
    players: Player[];
    turn: 'X' | 'O';
    board: (string | null)[];
    winner: 'X' | 'O' | 'DRAW' | null;
}

