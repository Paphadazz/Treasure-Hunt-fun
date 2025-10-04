import sqlite3 from "sqlite3";
import { open } from "sqlite";
import { Player } from "./player";

export async function initDB() {
    const db = await open({
        filename: './game.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            score INTEGER,
            isLeader INTEGER
        )
    `);

    return db;
}

export async function saveScores(db: any, players: Player[]) {
    const insert = await db.prepare("INSERT INTO scores (name, score, isLeader) VALUES (?, ?, ?)");
    for (const player of players) {
        await insert.run(player.name, player.score, player.isLeader ? 1 : 0);
    }
    await insert.finalize();
}

export async function showAllScores(db: any) {
    type ScoreRow = { id: number; name: string; score: number; isLeader: number };
    const rows: ScoreRow[] = await db.all("SELECT * FROM scores");
    console.table(rows.map((r: ScoreRow) => ({
        Name: r.name + (r.isLeader ? " 👑 (Leader)" : ""),
        Score: r.score,
        Leader: r.isLeader ? "✅" : ""
    })));
}
