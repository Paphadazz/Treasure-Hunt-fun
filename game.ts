import { PlayerManager, Player } from "./player";
import { saveScores } from "./db";
import prompt from "prompt-sync";

const inputPrompt = prompt({ sigint: true });
export const PASS_SCORE = 50;

export class MathGame {
    constructor(private playerManager: PlayerManager, private db: any) {}

    async start() {
        const players = this.playerManager.getPlayers();
        if (players.length === 0) {
            console.log("No players in the lobby!");
            return;
        }

        console.log("\n=== Math Challenge Stage ===");

        for (const player of players) {
            if (!player.inGame) continue;

            const num1 = Math.floor(Math.random() * 20) + 1;
            const num2 = Math.floor(Math.random() * 20) + 1;
            const answer = num1 + num2;

            const inputAnswer = inputPrompt(`${player.name}, calculate: ${num1} + ${num2} = ? `);
            if (parseInt(inputAnswer) !== answer) {
                console.log("Wrong! 10 points deducted.");
                player.deductScore(10); // ใช้ method ของ Player
            } else {
                console.log("Correct!");
            }
        }

        await this.endGame(players);
    }

    private async endGame(players: Player[]) {
        console.log("\n=== Final Scores ===");

        console.table(players.map(p => ({
            Name: p.name + (p.isLeader ? "  (Leader)" : ""),
            Score: p.score,
            Passed: p.score >= PASS_SCORE ? "pass" : "Didn't pass"
        })));

        await saveScores(this.db, players);
        console.log("\nScores saved to the database.");
        console.log("Returning to lobby...\n");
    }
}
