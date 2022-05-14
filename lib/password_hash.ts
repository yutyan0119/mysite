import bcrypt, { hash } from "bcrypt"

export class HashPassword{
    private readonly saltRounds: number;
    constructor (){
        this.saltRounds = 10;
    }
    async generate(password:string){
        return bcrypt.hash(password,this.saltRounds);
    }
    async compare(password:string,hash:string){
        return bcrypt.compare(password,hash);
    }
}