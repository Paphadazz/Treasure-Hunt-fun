import { PlayerManager } from "./player";
import { initDB } from "./db";
import { MathGame } from "./game";
import prompt from "prompt-sync";

const inputPrompt = prompt({ sigint: true });

export class TreasureHuntGame {
    private playerManager: PlayerManager;
    private mathGame: MathGame;
    private db: any;
    private MAX_PLAYERS = 3;

    constructor(db: any) {
        this.db = db;
        this.playerManager = new PlayerManager(this.MAX_PLAYERS);
        this.mathGame = new MathGame(this.playerManager, this.db);
    }

    async run() {
        console.log("=== Welcome to Treasure Hunt Game! ===");

        while (true) {
            this.showLobby();
            console.log("\nOptions: [join] Join Game | [start] Start Game | [exit] Leave Lobby | [view-score] Show Scores");
            const choice = inputPrompt("Enter your choice: ").trim().toLowerCase();

            switch(choice) {
                case "join": this.handleJoin(); break;
                case "start": await this.handleStart(); break;
                case "exit": this.handleExit(); break;
                case "view-score": await this.handleViewScores(); break;
                default: console.log("Invalid choice, please try again!");
            }
        }
    }

    private showLobby() {
        console.log("\n=== Lobby ===");
        const players = this.playerManager.getPlayers();
        if (players.length === 0) console.log("No players in the lobby yet.");
        else {
            players.forEach(p => console.log(p.isLeader ? `👑 ${p.name} (Leader)` : `- ${p.name}`));
        }
        console.log("================\n");
    }

    private handleJoin() {
        const name = inputPrompt("Enter your player name: ").trim();
        const player = this.playerManager.addPlayer(name);
        if (!player) console.log("Lobby is full!");
        else console.log(`${name} has joined the lobby!`);
    }

    private handleExit() {
        const name = inputPrompt("Enter the name of player leaving: ").trim();
        this.playerManager.removePlayer(name);
        console.log(`${name} has left the lobby.`);
    }

    private async handleStart() {
        if (this.playerManager.getPlayers().length === 0) {
            console.log("No players in the lobby. Cannot start game!");
            return;
        }
        await this.mathGame.start();
        console.log("\nGame round finished. Back to lobby.");
    }

    private async handleViewScores() {
        const dbModule = await import("./db");
        await dbModule.showAllScores(this.db);
    }
}

// main function
async function main() {
    const db = await initDB();
    const game = new TreasureHuntGame(db);
    await game.run();
}

main();
