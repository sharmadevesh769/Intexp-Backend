import express from 'express'
const router = express.Router()
import mongoose from 'mongoose'
import User from '../Schema/userSchema.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import authenticateJWT from "../MiddleWare/Auth.js";



router.post("/login",(req, res) => {
    const { email, password } = req.body
    User.findOne({ email: email }).then(user => {
        if (!user) {
            res.status(401).json({message:"User Not Found"})
        }
        else {
            bcrypt.compare(password, user.password).then(conf=>{
                if(conf){
                  const token =  jwt.sign({id:user._id},'djbeiuedui',{expiresIn:100000})
                
                    res.status(200).json({message:"Logged in",token:token})
                }else{
                    res.status(401).json({message:"Wrong Password plz check"})
                }
            })
        }
    })


})

router.get("/isAuthorized",authenticateJWT,(req,res) => {
    res.json({isAuthenticated: true})
})

router.post("/register", async (req, res) => {
    const { fname, lname, email, password } = req.body
    if (!fname || !email || !password) {
        res.send("Please Enter All Fields")
    }
    const taken = await User.findOne({ email: email })
    if (taken) {
       return res.status(404).json({message:"User Already Exists"})
    }
    else {
        const hashp = await bcrypt.hash(password, 10)
        const newUser = new User({
            fname, lname, email, password: hashp
        })
        newUser.save()
        return res.status(200).json({message:"Saved Succesfully"})

    }
})
export default router

