import { Router } from "express";
import {marked} from 'marked';


export const router = Router();
let markdowntxt = "### This page is being made now!";

let mtoH = marked.parse(markdowntxt);

/* GET home page. */
router.get('/', function(req,res,next) {
  res.render('net', { title: "yutyan's site", markdowntxt: mtoH });
});

