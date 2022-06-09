import { Router } from "express";
import { EEIC } from "../model/eeic";

export const router = Router();

router.get("/",(req,res,next)=>{
  res.send(JSON.stringify(EEIC.all()));
})

router.post('/',function(req,res,next){
  console.log(req.body);
  let eeic_name:string = req.body.name;
  let eeic_IP:string = req.body.IP;
  let new_user = new EEIC(eeic_name,eeic_IP);
  if (EEIC.findByName(eeic_name) != undefined){
    new_user.id = EEIC.findByName(eeic_name).id;
    console.log(new_user.id);
    new_user.update();
  }
  else {
    new_user.save()
  }
  res.send(JSON.stringify(EEIC.all()))
})