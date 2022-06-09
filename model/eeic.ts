import {databaseManager} from "../db/index";

export class EEIC {
    constructor(
        public name:string,
        public IP:string,
        public id? : number,
        public created_at? :Date,
        public updated_at? :Date,
    ){}
    save(){
        const db = databaseManager.getInstance();
        const stmt = db.prepare("insert into EEIC (name, IP) values ($name, $IP)");
        const re = stmt.run({
            name: this.name,
            IP: this.IP,
        });
        this.id = re.lastInsertRowid;
    }
    update(){
        const now = new Date();
        const db = databaseManager.getInstance();
        let formatDate = now.getFullYear() + "-" + digits(now.getMonth()+1,2) + "-" + digits(now.getDate(),2) + " "+digits(now.getHours(),2)+":"+digits(now.getMinutes(),2)+":"+digits(now.getSeconds(),2);
        console.log(this.id,this.name,this.IP,formatDate);
        const stmt = db.prepare("UPDATE EEIC SET name=$name, IP=$IP, updated_at=$updated_at where id=$id");
        const re = stmt.run({
            name: this.name,
            IP: this.IP,
            id:this.id,
            updated_at: formatDate,
        });
        return re.changes;
    }
    static all (){
        const db = databaseManager.getInstance();
        const stmt = db.prepare("select * from EEIC");
        const user_list = stmt.all();
        return user_list;
    }
    static findById(id:number){
        const db = databaseManager.getInstance();
        const stmt = db.prepare("select * from EEIC where id = $id");
        const userdata = stmt.get({
            id: id,
        });
        return userdata;
    }
    static findByIP(IP:string){
        const db = databaseManager.getInstance();
        const stmt = db.prepare("select * from EEIC where IP = $IP");
        const userdata = stmt.get({
            IP: IP,
        });
        return userdata;
    }

    static findByName(name:string){
        const db = databaseManager.getInstance();
        const stmt = db.prepare("select * from EEIC where name = $name");
        const userdata = stmt.get({
            name: name,
        });
        return userdata;
    }
}


const digits = (num: number, length: number): string => {
    return `${num}`.padStart(length, "0");
  };