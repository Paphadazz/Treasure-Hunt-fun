import { PlayerManager } from "./player";
import { initDB } from "./db";
import { showLobby } from "./lobby";
import { startGame } from "./game";
import prompt from 'prompt-sync';

const inputPrompt = prompt({ sigint: true });
const MAX_PLAYERS = 3;
const playerManager = new PlayerManager(MAX_PLAYERS);

async function main() {
    const db = await initDB();

    console.log("=== Welcome to Treasure Hunt Game! ===");

    while (true) {
        console.log("\nOptions: [join] Join Game | [start] Start Game | [exit] Leave Lobby | [view-score] Show Scores");
        const input = inputPrompt("Enter your choice: ").trim().toLowerCase();

        if (input === 'join') {
            const name = inputPrompt("Enter your player name: ").trim();
            const player = playerManager.addPlayer(name);
            if (!player) console.log("Lobby is full!");
            else console.log(`${name} has joined the lobby!`);
            showLobby(playerManager);

        } else if (input === 'start') {
            if (playerManager.getPlayers().length === 0) {
                console.log("No players in the lobby. Cannot start game!");
            } else {
                await startGame(playerManager, db); // เริ่มเกม และวนจบเกม
                console.log("\nGame round finished. Back to lobby.");
                showLobby(playerManager);
            }

        } else if (input === 'exit') {
            const name = inputPrompt("Enter the name of player leaving: ").trim();
            playerManager.removePlayer(name);
            console.log(`${name} has left the lobby.`);
            showLobby(playerManager);

        } else if (input === 'view-scores') {
            await import("./db").then(dbModule => dbModule.showAllScores(db));

        } else {
            console.log("Invalid choice, please try again!");
        }
    }
}

main();
