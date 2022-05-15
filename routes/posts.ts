import { Router } from "express";
import { Posts } from "../model/post_article";
import {marked} from "marked";
import {body,validationResult}from 'express-validator';
import sanitizeHtml from 'sanitize-html';
export const router = Router();

const omit = async (text:string, len:number, ellipsis:string) =>{
    return text.length >= len ? text.slice(0, len - ellipsis.length) + ellipsis: text
};



router.get('/', async function(req, res, next) {
    const posts = await Posts.get_all();
    for (let i in posts){
        let article = posts[i].article;
        posts[i]["article_top"] = await omit(article,20,"...");
    }
    let auth = false;
    if (req.session.user_id){
        auth = true;
    }
    res.render('posts/posts',{ title: "yutyan's site",posts: posts, auth: auth});
});

router.get('/new',async function (req,res,next){
    if (!req.session.user_id){
        res.redirect("/posts");
    }
    else {
        res.render('posts/post_create',{title: "yutyan's site"});
    }
})

router.post('/new',
    body("title").isLength({min:1,max:100}),
    body("body").isLength({min:1}),
    async function (req,res,next){
    const err = validationResult(req);
    if (!err.isEmpty()){
        return res.status(400).json({erros: err.array()});
    }  
    if (!req.session.user_id){
        res.redirect("/");
        return;
    }
    let title = req.body.title;
    let body = req.body.body;
    let user_name = req.session.user_name;
    let user_id = req.session.user_id;
    let post = await new Posts(user_id,user_name,title,body);
    let data = await post.save();
    console.log(data.lastInsertRowid);
    let id = String(data.lastInsertRowid);
    res.redirect('/posts/'+id);
})


router.post('/:id/edit',
    body("title").isLength({min:1,max:100}),
    body("body").isLength({min:1}),
    async function (req,res,next){
    const err = validationResult(req);
    if (!err.isEmpty()){
        return res.status(400).json({erros: err.array()});
    }  
    const posts = new Posts();
    let id = Number(req.params.id);
    let body = req.body.body;
    let title = req.body.title;
    await posts.updatefrom_id(title,body,id);
    res.redirect('/posts/'+id);
})

router.get('/:id/edit', async function (req,res,next){
    const posts = new Posts();
    let id = Number(req.params.id);
    let post =  Posts.findfrom_id(id);
    if (!post){
        res.redirect('/posts');
        return;
    }
    else if (post["user_id"]===req.session.user_id){
        res.render('posts/post_edit',{title: "yutyan's site",post: post});
        return;
    }
    else {
        res.redirect('/posts/'+req.params.id);
        return;
    }
})

router.get('/:id/delete', async function (req,res,next){
    let id = Number(req.params.id);
    if ( Posts.findfrom_id(id).user_id ===req.session.user_id){
        await Posts.deletefrom_id(id);
        res.redirect("/posts");
    }
    else {
        res.redirect("/posts");
    }
})

router.get('/:id',async function (req,res,next){
    const posts = new Posts();
    let id = Number(req.params.id);
    if (!id){
        res.redirect('/posts');
        return;
    }
    let post = await Posts.findfrom_id(id);
    if (!post){
        res.redirect('/posts');
        return;
    }
    if (post["article_html"] === null){
        post["article_html"] = sanitizeHtml(marked.parse(post.article),{
			allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
		});
        await Posts.inserthtml(id,post["article_html"]);
    }
    let auth = (post["user_id"] == req.session.user_id);
    res.render('posts/post_show',{title: "yutyan's site",post: post,auth: auth});
})


router.post("/presave",async function (req,res){
    let hoge = await sanitizeHtml(marked.parse(req.body.body),{
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
    });
    res.send(hoge);
})