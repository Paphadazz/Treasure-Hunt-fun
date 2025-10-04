export type Player = {
    id: number;
    name: string;
    score: number;
    inGame: boolean;
    isLeader: boolean;
};

export class PlayerManager {
    private players: Player[] = [];
    private maxPlayers: number;

    constructor(maxPlayers: number) {
        this.maxPlayers = maxPlayers;
    }

    addPlayer(name: string): Player | null {
        if (this.players.length >= this.maxPlayers) return null;
        const player: Player = {
            id: this.players.length + 1,
            name,
            score: 100,
            inGame: true,
            isLeader: this.players.length === 0 // first player is leader
        };
        this.players.push(player);
        return player;
    }

    removePlayer(name: string) {
        this.players = this.players.filter(p => p.name !== name);
        // update leader if current leader leaves
        if (!this.players.some(p => p.isLeader) && this.players.length > 0) {
            this.players[0].isLeader = true;
        }
    }

    getPlayers() {
        return this.players;
    }

    getLeader() {
        return this.players.find(p => p.isLeader);
    }
}
