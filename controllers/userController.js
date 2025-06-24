require('dotenv').config()
const redis=require('../config/redis')
const User=require('../models/User')
const {isValidEmail} = require('../utility/validate')
const getMyData= async(req,res)=>{
    const user =await User.findById(req.user.userID)
    if(!user){ return res.status(404).json({msg:"there is no user"})}
    return res.status(200).json({userData: user})
}

const updateUserData=async(req,res)=>{
    let {name,username , email ,profileImageURL} =req.body
    if(!name && !username && !email && !req.file){
        return res.status(400).json({msg:"Please provide at least one field to update"})
        }
     if (email) {
    const result = await isValidEmail(email);
    if (!result.valid) {
      return res.status(400).json({ msg: result.msg });
    }
  }
    if (req.file) {
        profileImageURL = req.file.path;
        }

    const updates = {
      ...(name && { name }),
      ...(username && { username }),
      ...(email && { email }),
      ...(profileImageURL && { profileImageURL }),
    };

    const user=await User.findByIdAndUpdate(req.user.userID,updates,{new:true})

    if(!user){return res.status(404).json({msg:"there is no user"})}
 

    return res.status(200).json({user:user})
}

const deleteUser=async(req,res)=>{
    const user = await User.findByIdAndDelete(req.user.userID)
    if(!user){ return res.status(404).json({msg:"there is no user"})}
    res.clearCookie("access_token");
    await redis.del(`refresh:${req.user.userID}`);
    return res.status(200).json({msg:"user deleted successfully",user:user})
}

const getMyPosts= async(req,res)=>{
    const id=req.user.userID
    const user=await User.findById(id).populate('posts')
    if(!user){ return res.status(404).json({msg:"there is no user"})}
    return res.status(200).json({msg:"success",myPosts:user.posts})
}
module.exports={getMyData,updateUserData,deleteUser,getMyPosts}