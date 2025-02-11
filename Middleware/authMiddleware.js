const jwt=require('jsonwebtoken')
const redis = require('../config/redis')
const User=require('../models/User')
//========================================================================
const isLoggedIn=(req,res,next)=>{
if(req.cookies&&req.cookies.access_token){
  // verifyToken(req, res, next)
   return res.status(403).json({msg:"you are already logged in"})
}
  return next()
}
//==========================================================================================

//==========================================================================================
const refreshAccessToken=(refreshToken)=>{
  const userPayload=jwt.verify(refreshToken,process.env.SECRET_TOKEN)
  const newAccessToken=jwt.sign(userPayload, process.env.SECRET_TOKEN, { expiresIn: "1h" });
  return newAccessToken
}



const verifyToken= async (req, res, next) => {
    const accessToken = req.cookies.access_token 
    if (!accessToken) {
        return res.status(401).json({ message: "Unauthorized, you must have accessToken to do this" });
    }

    try {
        const decodedPayload = jwt.verify(accessToken, process.env.SECRET_TOKEN ); 
//====================================================================================

const user = await User.findById(decodedPayload.userID);

        if (!user) {
            return res.status(404).json({ msg: "User not found1" });
        }

        
        if (user.isBanded) {
            res.clearCookie("access_token");
            await redis.del(`refresh:${user.userID}`);
            return res.status(403).json({ msg: "You have been blocked. Please contact support." });
        }
//====================================================================================

        req.user = decodedPayload;
    
        return next();
    } catch (error) {
      
        if (error.name === "TokenExpiredError") {
          console.log("JWT expired")
          const userPayload=jwt.decode(accessToken)
         
          const refresh= await redis.get((`refresh:${userPayload.userID}`))
         
          const newAccessToken=refreshAccessToken(refresh)
          if (!newAccessToken){
            return res.status(500).json({ error: "failed refreshToken",msg:error.message  });
          }
          res.cookie("access_token", newAccessToken, { httpOnly: true, secure: false, });
       
          req.user = userPayload;
          return next();

          } else {

            console.log(error)
            return res.status(403).json({msg:"invalid token"})
          }
    }
};






//==========================================================================================
const isAdmin =async(req,res,next)=>{
  const  role=req.user.role
  if(!role){return res.status(404).json({msg:"user not found"})}
  if(role==="Admin"){return next()}
  return res.status(401).json({msg:"this command is only for admins "})
}


//==========================================================================================
module.exports={isLoggedIn,verifyToken,isAdmin}