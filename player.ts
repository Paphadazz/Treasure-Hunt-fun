export class Player {
    public score: number;
    public inGame: boolean;
    public isLeader: boolean;

    constructor(
        public id: number,
        public name: string,
        score: number = 100,
        inGame: boolean = true,
        isLeader: boolean = false
    ) {
        this.score = score;
        this.inGame = inGame;
        this.isLeader = isLeader;
    }

    addScore(points: number) {
        this.score += points;
    }

    deductScore(points: number) {
        this.score -= points;
    }

    setLeader(isLeader: boolean) {
        this.isLeader = isLeader;
    }

    setInGame(inGame: boolean) {
        this.inGame = inGame;
    }
}

export class PlayerManager {
    private players: Player[] = [];

    constructor(private maxPlayers: number) {}

    addPlayer(name: string): Player | null {
        if (this.players.length >= this.maxPlayers) return null;

        const player = new Player(
            this.players.length + 1,
            name,
            100,
            true,
            this.players.length === 0 // first player is leader
        );

        this.players.push(player);
        return player;
    }

    removePlayer(name: string) {
        this.players = this.players.filter(p => p.name !== name);

        // update leader if current leader leaves
        if (!this.players.some(p => p.isLeader) && this.players.length > 0) {
            this.players[0].setLeader(true);
        }
    }

    getPlayers(): Player[] {
        return this.players;
    }

    getLeader(): Player | undefined {
        return this.players.find(p => p.isLeader);
    }
}
