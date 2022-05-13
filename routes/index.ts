import { Router } from "express";
import {exec} from 'child_process';

export const router = Router();

router.get('/', function(req, res, next) {
    exec('vcgencmd measure_temp', (error,stdout,stderr) =>{
      if(error) return console.error('ERROR',error);
      res.render('index', { title: "yutyan's site",temp: stdout });
    });
    if (req.session.views===null){
      req.session.views = 0;
    }
    else {
      req.session.views += 1;
    }
    console.log(req.session.views);
  });