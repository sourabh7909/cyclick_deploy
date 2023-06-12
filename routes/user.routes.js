const express=require("express")
const { UserModel } = require("../model/user.model")
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
require("dotenv").config()
const userRouter= express.Router()


userRouter.post("/register",async(req,res)=>{
    const {name,email,password}=req.body
    try {
       bcrypt.hash(password,5,async(err,hash)=>{
            if(hash){
                const user=new UserModel({name,email,password:hash})
                await user.save()
                res.status(200).json({msg:"new user has been registerd",user:req.body})
            }
        })
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try {
        const user=await UserModel.findOne({email})
        if(user){
            bcrypt.compare(password,user.password,(err,result)=>{
                if(result){
               const token= jwt.sign({userID:user._id,user:user.name},process.env.secret)
                    res.status(200).json({msg:"Login succesful",token:token})
                }else{
                    res.status(200).json({msg:"Invalid credential!"})
                }
            })
        }else{
            res.status(200).json({msg:"user not found"})
        }
    } catch (error) {
        res.status(400).json({error:error.message})
    }
})


module.exports={userRouter}