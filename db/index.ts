// import sqlite3 from "sqlite3";
// import { open, Database } from "sqlite";
import Database from 'better-sqlite3';
import path from "path";

export class DatabaseManager {
    public filePath;
    public database?;
    constructor(filePath:string) {
        this.filePath = filePath;
    }
    async getInstance() {
        if (!this.database) {
            this.database = new Database(this.filePath);
        }
        return this.database;
    }
    async close() {
        if (!this.database) return;
        await this.database.close();
    }
}

export let databaseManager = new DatabaseManager(path.join(path.resolve(),"db","test.db"));