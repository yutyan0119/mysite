import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import path from "path";

export class DatabaseManager {
    public filePath;
    public database?:Database<sqlite3.Database, sqlite3.Statement>;
    constructor(filePath:string) {
        this.filePath = filePath;
    }
    async getInstance() {
        if (!this.database) {
            this.database = await open({
                filename: this.filePath,
                driver: sqlite3.Database,
            });
        }
        return this.database;
    }
    async close() {
        if (!this.database) return;
        await this.database.close();
    }
}

export let databaseManager = new DatabaseManager(path.join(path.resolve(),"db","test.db"));