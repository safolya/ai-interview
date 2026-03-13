const jwt=require("jsonwebtoken");
const blacklistModel=require("../model/blacklist.model");

const authUser=async(req,res,next)=>{
    try {
       const token=req.cookies.token; 
       if(!token){
        return res.status(401).json({message:"Unauthorized"});
       }
         const blacklisted=await blacklistModel.findOne({token});
         if(blacklisted){
            return res.status(401).json({message:"Token is blacklisted"});
         }
       const decoded=jwt.verify(token,process.env.JWT_SECRET_KEY);
       req.user=decoded;
       next();
    } catch (error) {
        return res.status(401).json({message:"Invalid token"});
    }
}

module.exports=authUser;