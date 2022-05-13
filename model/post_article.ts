import {databaseManager} from "../db/index";
import {marked} from "marked";
// const db = new sqlite3.Database("/home/yuto/project/markdowntohtml/db/test.db");

export class Posts {
	constructor(
		public author?:string,
		public title? :string,
		public article?:string,
		public id?:number,
		public created_at?:Date,
		public updated_at?:Date,
		public article_html?:string,
	) {}

	async save(author?:string, article?:string, title?:string) {
		const db =  databaseManager.getInstance();
		this.author = this.author??author;
		this.article = this.article??article;
		this.title = this.title??title;
		this.article_html = marked.parse(this.article);
		console.log(this.article_html);
		const a =  db.prepare("insert into posts (author, article, title, article_html) values ($author, $article, $title, $article_html)");
		const b = a.run({
			author: this.author,
			article: this.article,
			title: this.title,
			article_html: this.article_html,
		})
		return b.lastID;
	};

	async deletefrom_id(id:number){
		const db =  databaseManager.getInstance();
		const a =  db.prepare("delete  from posts where id = $id");
		const b = a.run({
			id: id
		});
		return b.changes;
	}

	static async get_all() {
		const db =  databaseManager.getInstance();
		const stmt = db.prepare('select * from posts')
		const postlist =  stmt.all();
		return postlist;
	}

	static async findfrom_author(author:string) {
		const db =  databaseManager.getInstance();
		const stmt = db.prepare('select * from posts where author = ?')
		const postlist:any[] = stmt.all(author);
		return postlist;
	}

	static async findfrom_id(id:number) {
		const db =  databaseManager.getInstance();
		const stmt = db.prepare('select * from posts where id = ?');
		const data = stmt.get(id);
		return data;
	}

	async updatefrom_id(title:string,article:string,id:number, ){
		const db =  databaseManager.getInstance();
		this.id = id;
		this.title = title;
		this.article= article;
		let date = new Date();
		this.article_html = marked.parse(this.article);
		let formatDate = date.getFullYear() + "-" + digits(date.getMonth()+1,2) + "-" + digits(date.getDate(),2) + " "+digits(date.getHours(),2)+":"+digits(date.getMinutes(),2)+":"+digits(date.getSeconds(),2);
		const a = db.prepare("update posts set title = $title, article = $article, updated_at = $nowdate, article_html=$article_html where id = $id");
		const b = a.run({
			title: this.title,
			article: this.article,
			nowdate: formatDate,
			id: id,
			article_html: this.article_html,
		})
		return b.changes;
	}

	static async inserthtml(id:number,article_html:string) {
		const db =  databaseManager.getInstance();
		const a = db.prepare("update posts  set article_html = $article_html where id = $id");
		const b = a.run({
			id: id,
			article_html: article_html,
		});
		return b.changes;
	}

};
const digits = (num: number, length: number): string => {
    return `${num}`.padStart(length, "0");
  };