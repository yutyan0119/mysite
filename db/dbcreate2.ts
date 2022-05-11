import sqlite3 from "sqlite3";
const db = new sqlite3.Database("./test.db");

db.serialize(() => {
    db.run("drop table if exists temp");
    db.run("create table temp (id integer primary key autoincrement, author text(255) not null,title text(100) not null, article text not null, created_at date default current_timestamp, updated_at date)");
});

db.close();


