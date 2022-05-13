import { Router } from "express";
import { Posts } from "../model/post_article";
import {marked} from "marked";
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
    res.render('posts',{ title: "yutyan's site",posts: posts});
});

router.get('/new',async function (req,res,next){
    console.log("aa");
    res.render('post_create',{title: "yutyan's site"});
})

router.post('/new',async function (req,res,next){
    console.log(req.body);
    let title = req.body.title;
    let body = req.body.body;
    let author = req.body.author;
    let post = await new Posts(author,title,body);
    let id = await post.save();
    res.redirect('/posts/'+id);
})


router.post('/:id/edit',async function (req,res,next){
    const posts = new Posts();
    let id = Number(req.params.id);
    let body = req.body.body;
    let author = req.body.author;
    let title = req.body.title;
    await posts.updatefrom_id(title,body,id);
    res.redirect('/posts/'+id);
})

router.get('/:id/edit', async function (req,res,next){
    const posts = new Posts();
    let id = Number(req.params.id);
    let post = await Posts.findfrom_id(id);
    res.render('post_edit',{title: "yutyan's site",post: post});
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
    }
    if (post["article_html"] === null){
        post["article_html"] = marked.parse(post.article);
        await Posts.inserthtml(id,post["article_html"]);
    }
    res.render('post_show',{title: "yutyan's site",post: post});
})


router.post("/presave",async function (req,res){
    let hoge = await marked.parse(req.body.body);
    res.send(hoge);
})