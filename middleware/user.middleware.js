const jwt=require("jsonwebtoken")
require("dotenv").config()
const Auth=(req,res,next)=>{
    const token=req.headers.authorization?.split(" ")[1]
  try {
    if(token){
    jwt.verify(token,process.env.secret,(err,decode)=>{
        if(decode){
           req.body.userID=decode.userID
           req.body.user=decode.user
            next()
        }else{
            res.status(200).json({msg:"invalid token"})
        }
    })
    }else{
        res.status(200).json({msg:"Please Login"})
    }
  } catch (error) {
     res.status(400).json({error:error.message})
  }
}

module.exports={Auth}