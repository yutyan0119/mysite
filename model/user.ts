import {databaseManager} from "../db/index";

export class Users {
    constructor(
        public name:string,
        public email:string,
        public password :string,
        public id? : number,
        public created_at? :Date,
        public updated_at? :Date,
    ){}
    save(){
        const db = databaseManager.getInstance();
        const stmt = db.prepare("insert into users (name, email, password) values ($name, $email, $password)");
        const re = stmt.run({
            name: this.name,
            email: this.email,
            password: this.password
        });
        this.id = re.lastInsertRowid;
    }
    update(){
        const now = new Date();
        this.updated_at = this.updated_at??now;
        const db = databaseManager.getInstance();
        const stmt = db.prepare("insert into users (name, email, password, updated_at) values ($name, $email, $password, $updated_at)");
        const re = stmt.run({
            name: this.name,
            email: this.email,
            password: this.password,
            updated_at: this.updated_at
        });
        return re.changes;
    }
    static all (){
        const db = databaseManager.getInstance();
        const stmt = db.prepare("select * from users");
        const user_list = stmt.all();
        return user_list;
    }
    static findById(id:number){
        const db = databaseManager.getInstance();
        const stmt = db.prepare("select * from users where id = $id");
        const userdata = stmt.get({
            id: id,
        });
        return userdata;
    }
    static findByEmail(email:string){
        const db = databaseManager.getInstance();
        const stmt = db.prepare("select * from users where email = $email");
        const userdata = stmt.get({
            email: email,
        });
        return userdata;
    }

    static findByName(name:string){
        const db = databaseManager.getInstance();
        const stmt = db.prepare("select * from users where name = $name");
        const userdata = stmt.get({
            name: name,
        });
        return userdata;
    }
}