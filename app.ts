import createError from "http-errors";
import express from "express";
import { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import layouts from "express-ejs-layouts";
import { router as indexRouter } from "./routes/index";
import { router as netRouter } from "./routes/net";
import { router as raspRouter } from "./routes/raspi";
import { router as postRouter } from "./routes/posts";
import {databaseManager} from "./db/index";
const session = require("express-session");
const SqliteStore = require("better-sqlite3-session-store")(session);
const db = databaseManager.getInstance();
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
declare module 'express-session' {
    interface SessionData {
        views:number;
    }
  }
  

app.use(
    session({
        store: new SqliteStore({
            client: db,
            expired: {
                clear: true,
                intervalMs: 900000
            }
        }),
        secret: "hogehoge",
        resave: false,
        cookie: {maxAge: 900000},
        saveUninitialized: true
    })
)

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(layouts);




app.use("/", indexRouter);
app.use("/net", netRouter);
app.use("/raspi", raspRouter);
app.use("/posts", postRouter);

app.use((req: Request, res: Response, next: NextFunction) =>
    next(createError(404,'page not found'))
);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    res.status(err.status || 500);
    res.render("error");
});



app.listen(51515,()=>{
    console.log('start port to 51515')
});
//本番環境は3000番or開発は51515

module.exports = app;