require('dotenv').config()
const User=require('../models/User')
const passport=require('passport')

const bcrypt=require('bcrypt')
const validator = require('validator');

//=========================================
const jwt=require('jsonwebtoken')
const redis=require('../config/redis')

//=========================================================================

const localLogin = (req, res, next) => {
  passport.authenticate('local', { session: false }, async(err, user, info) => {
      if (err) return res.status(500).json({ message: "Server error", error: err }) 
      if (!user) return res.status(401).json({ message: info?.message|| "Invalid username or password" }) 
       if(user.isBanded===true){return res.status(401).json({msg:"sorry, admin banded you"}) }

       const Payload={userID:user._id.toString(),role:user.role}
      const accessToken = jwt.sign(Payload, process.env.SECRET_TOKEN, { expiresIn: "1h" });
      const refreshToken = jwt.sign(Payload, process.env.SECRET_TOKEN);
      await redis.set(`refresh:${user._id.toString()}`,  refreshToken); 
      res.cookie("access_token", accessToken, { httpOnly: true, secure: false, });
      
      return res.send('logged in successfully , you are in home page')//res.redirect('/Home')
  })(req, res, next)
}

//=========================================================================
const googleAuth=passport.authenticate("google", { scope: ["profile", "email"] });
//----------
const googleAuthCallback=async (req, res, next) => {
    passport.authenticate("google", { session: false }, async(err, user, info) => {
        if (err || !user) {
            return res.status(400).json({ message: "Google authentication failed" });
        }

        console.log("33333333333333333333333333333333333\n");console.log(user);console.log("33333333333333333333333333333333333\n")

             //==========================================
      const Payload={userID:user.user._id.toString(),role:user.user.role}
      const accessToken = jwt.sign(Payload, process.env.SECRET_TOKEN, { expiresIn: "1h" });
      const refreshToken = jwt.sign(Payload, process.env.SECRET_TOKEN);
      await redis.set(`refresh:${user.user._id.toString()}`,  refreshToken); 
      res.cookie("access_token", accessToken, { httpOnly: true, secure: false, });
            //==========================================
            return res.redirect('/Home')
        


    })(req, res, next);
};
//=========================================================================
const logout=async(req,res)=>{
  
     
    res.clearCookie("access_token");
    await redis.del(`refresh:${req.user.userID}`);
    res.status(200).json({msg:"logged out"})
  

}
//=========================================================================

const register = async(req,res)=>{
    const {name,email,username,password}=req.body
//===================================================================check email=============================================
//is eil valid
     if(!validator.isEmail(email)){
       return res.status(400).json({msg:"this is not an email"})
     }
//is email already token
     const emailisExists=await User.findOne({email:email})
     if(emailisExists){
        return res.status(400).json({msg:"this email is already used"})
     }
//===================================================================check username=============================================
//is username already token
const usernameisExists=await User.findOne({username:username})
if(usernameisExists){
   return res.status(400).json({msg:"this username is already used"})
}
//===================================================================check password=============================================
if(!validator.isStrongPassword(password)){
    return res.status(400).json({msg:"Password must be at least 8 characters long and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character."})
}


//================================================================================================================
const profileImageURL = req.file ? req.file.path : undefined;


//================================================================================================================
    const hashed =await bcrypt.hash(password,10)
    const newUser=new User({
         name,
         email,
         username,
         password:hashed,
         profileImageURL
    })
    await newUser.save()
    res.send("welcome")//res.redirect('/auth/login')

}

//=========================================================================
const {sendEmailWithLink} =require('../config/mailer')
const forgetPassword=async(req,res)=>{
    const {email} =req.body
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
        }
        const subject = "Reset password";
        const linkText = "click here to Reset password";
        const linkUrl = `http://localhost:3000/auth/recreatePassword?email=${encodeURIComponent(email)}`;

        const response = await sendEmailWithLink(email, subject, linkText, linkUrl);

        if (response.success) {
            return res.status(200).json({ msg: "تم إرسال البريد الإلكتروني بنجاح" });
        } else {
            return res.status(500).json({ error: "فشل في إرسال البريد الإلكتروني" });
        }
}

const recreatePassword=async(req,res)=>{
    let {email}=req.query
    const {newPassword}=req.body
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
        }
        email = decodeURIComponent(email);
        console.log(email)

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Email not found" });
        }

        
        //===================================================================check password=============================================
if(!validator.isStrongPassword(newPassword)){
    return res.status(400).json({msg:"Password must be at least 8 characters long and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character."})
}
//================================================================================================================
    const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save(); 

    return  res.status(200).json({msg:"password recreated successfully, go back to login page"})

}
//=========================================================================

module.exports={register,localLogin,logout,googleAuth,googleAuthCallback,forgetPassword,recreatePassword}