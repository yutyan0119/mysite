import {databaseManager} from "../db/index";
// const db = new sqlite3.Database("/home/yuto/project/markdowntohtml/db/test.db");

export class Posts {
	constructor(
		public author?:string,
		public title? :string,
		public article?:string,
		public id?:number,
		public created_at?:Date,
		public updated_at?:Date,
	) {}

	async save(author?:string, article?:string, title?:string) {
		const db = await databaseManager.getInstance();
		this.author = this.author??author;
		this.article = this.article??article;
		this.title = this.title??title;
		const {lastID} = await db.run("insert into posts (author, article, title) values ($author, $article,$title)", {
			$author: this.author,
			$article: this.article,
			$title: this.title,
		}
		);
		return lastID;
	};

	async deletefrom_id(id:number){
		const db = await databaseManager.getInstance();
		const a = await db.run("delete  from posts where id = $id",{
			$id: id
		});
		return a.changes;
	}

	static async get_all() {
		const db = await databaseManager.getInstance();
		const postlist = await db.all("select * from posts");
		return postlist;
	}

	static async findfrom_author(author:string) {
		const db = await databaseManager.getInstance();
		const postlist:any[] = await db.all("select * from posts where author = $author", {
			$author: author
		});
		return postlist;
	}

	static async findfrom_id(id:number) {
		const db = await databaseManager.getInstance();
		const data = await db.get("select * from posts where id = $id",{
			$id: id
		});
		return data;
	}

	async updatefrom_id(title:string,article:string,id:number, ){
		const db = await databaseManager.getInstance();
		this.id = id;
		this.title = title;
		this.article= article;
		let date = new Date();
		let formatDate = date.getFullYear() + "-" + (date.getMonth()+1) + "-" + date.getDate() + " "+date.getHours()+":"+date.getMinutes()+":"+date.getSeconds();
		const a = await db.run("update posts set title = $title, article = $article, updated_at = $nowdate where id = $id",{
			$title: this.title,
			$article: this.article,
			$nowdate: formatDate,
			$id: id,
		});
		return a.changes;
	}

};