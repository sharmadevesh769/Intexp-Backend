import express  from "express";
import Res from "../Schema/resSchema.js";
const router = express.Router()
import authenticateJWT from "../MiddleWare/Auth.js";
router.get('/res/:topic',async (req,res)=>{
    const {topic} = req.params;
    const data=await Res.find({Topic1: topic});
    
    return res.json({data})
})
router.post('/res',async (req,res)=>{
    const{title,Topic1,Topic2,Topic3,Link1,Link2}=req.body;

    const data=new Res({
        title,
        Topic1,
        Topic2,
        Topic3,
        Link1,
        Link2
    })

    data.save()

    return res.json({data})
})

export default router