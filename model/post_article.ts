import {databaseManager} from "../db/index";
import {marked} from "marked";
import sanitizeHtml from 'sanitize-html';

// const db = new sqlite3.Database("/home/yuto/project/markdowntohtml/db/test.db");

export class Posts {
	constructor(
		public user_id? :number,
		public user_name?:string,
		public title? :string,
		public article?:string,
		public draft?:number,
		public id?:number,
		public created_at?:Date,
		public updated_at?:Date,
		public article_html?:string,
	) {}

	async save(user_id?:number,user_name?:string, article?:string, title?:string, draft?:number) {
		const db =  databaseManager.getInstance();
		this.user_id = this.user_id??user_id;
		this.user_name = this.user_name??user_name;
		this.article = this.article??article;
		this.title = this.title??title;
		this.draft = this.draft??draft;
		this.article_html = sanitizeHtml(marked.parse(this.article),{
			allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img','del' ])
		});
		const a =  db.prepare("insert into posts (user_id, user_name, article, title, article_html, draft) values ($user_id,$user_name, $article, $title, $article_html, $draft)");
		const b = a.run({
			user_id: this.user_id,
			user_name: this.user_name,
			article: this.article,
			title: this.title,
			article_html: this.article_html,
			draft: this.draft,
		})
		console.log(b);
		return b;
	};

	static async deletefrom_id(id:number){
		const db =  databaseManager.getInstance();
		const a =  db.prepare("delete  from posts where id = $id");
		const b = a.run({
			id: id
		});
		return ;
	}

	static async get_all() {
		const db =  databaseManager.getInstance();
		const stmt = db.prepare('select * from posts where draft = 0')
		const postlist =  stmt.all();
		return postlist;
	}

	static find_draft(user_id:number){
		const db = databaseManager.getInstance();
		const stmt = db.prepare('select * from posts where user_id = $user_id and draft = 1');
		const result = stmt.all({
			user_id: user_id
		})
		console.log(result);
		return result;
	}

	static async findfrom_user(user_name:string) {
		const db =  databaseManager.getInstance();
		const stmt = db.prepare('select * from posts where user_name = ?')
		const postlist:any[] = stmt.all(user_name);
		return postlist;
	}

	static findfrom_id(id:number) {
		const db =  databaseManager.getInstance();
		const stmt = db.prepare('select * from posts where id = ?');
		const data = stmt.get(id);
		return data;
	}

	async updatefrom_id(title:string,article:string,id:number, draft:number){
		const db =  databaseManager.getInstance();
		this.id = id;
		this.title = title;
		this.article= article;
		this.draft = draft;
		let date = new Date();
		this.article_html = sanitizeHtml(marked.parse(this.article),{
			allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img','del' ])
		});
		let formatDate = date.getFullYear() + "-" + digits(date.getMonth()+1,2) + "-" + digits(date.getDate(),2) + " "+digits(date.getHours(),2)+":"+digits(date.getMinutes(),2)+":"+digits(date.getSeconds(),2);
		const a = db.prepare("update posts set title = $title, article = $article, updated_at = $nowdate, article_html=$article_html, draft = $draft where id = $id");
		const b = a.run({
			title: this.title,
			article: this.article,
			nowdate: formatDate,
			id: id,
			article_html: this.article_html,
			draft: this.draft,
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