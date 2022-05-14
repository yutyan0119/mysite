import { Router } from "express";
import { Users } from "../model/user";
import {HashPassword} from "../lib/password_hash";
import {body,validationResult}from 'express-validator';
export const router = Router();


router.get("/",(req,res,next)=>{
    const users = Users.all();
    res.render('users/index',{users: users});
})

router.get("/sign_in",(req,res,next)=>{
    res.render('users/sign_in');
})

router.post("/sign_in",
    body('user_name').isLength({min:1}),
    body('password').isLength({min:6}),
    async (req,res,next)=>{
    const err = validationResult(req);
    if (!err.isEmpty()){
        return res.status(400).json({erros: err.array()});
    }      
    let name = req.body.user_name;
    let password = req.body.password;
    const user = Users.findByName(name);
    if (!user){
        res.redirect("/");
        return;
    }
    if (await new HashPassword().compare(password,user.password)){
        console.log("ok");
        req.session.user_id = user.id;
        req.session.user_name = user.name;
        res.redirect("/users");
    }else {
        res.redirect("/")
    }
})

router.get("/sign_out", (req,res,next)=>{
    req.session.destroy((err)=>{
        console.log(err);
    });
    res.redirect("/");
})

router.get("/sign_up",(req,res,next)=>{
    res.render('users/sign_up');
})

router.post("/sign_up",
            body('email').isEmail(),
            body('password').isLength({min:6}),
            async (req,res,next)=>{
    const err = validationResult(req);
    if (!err.isEmpty()){
        return res.status(400).json({erros: err.array()});
    }             
    let name = req.body.user_name;
    let email = req.body.email;
    let password = req.body.password;
    let cpassword = req.body.Cpassword;
    if (Users.findByEmail(email)){
        res.redirect("/users/sign_up");
        return;
    }
    if (Users.findByName(name)){
        res.redirect("/users/sign_up");
        return;
    }
    if (password != cpassword){
        res.redirect('/users/sign_up');
        return;
    }
    const Hashedpassword = await new HashPassword().generate(password);
    let newUser = new Users(name,email,Hashedpassword);
    newUser.save();
    let newuser_id = newUser.id;
    req.session.user_id = newUser.id;
    req.session.user_name = newUser.name;
    let pathid = String(newuser_id);
    res.redirect('/users/'+pathid);
})

router.get("/yourid",(req,res,next)=>{
    res.render('users/id',{id: req.session.user_id});
})

router.get("/:id",(req,res,next)=>{
    let id = Number(req.params.id);
    let user = Users.findById(id);
    res.render('users/show',{user: user});
})