import { PlayerManager } from "./player";

export function showLobby(playerManager: PlayerManager) {
    console.log("\n=== Lobby ===");
    const players = playerManager.getPlayers();
    if (players.length === 0) {
        console.log("No players in the lobby yet.");
    } else {
        players.forEach(p => {
            if (p.isLeader) console.log(`👑 ${p.name} (Leader)`);
            else console.log(`- ${p.name}`);
        });
    }
    console.log("================\n");
}
