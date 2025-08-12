require('dotenv').config()
const redis=require('../config/redis')
const User=require('../models/User')
const {isValidEmail} = require('../utility/validate')
const getMyData= async(req,res)=>{
    const user =await User.findById(req.user.userID)
    if(!user){ return res.status(404).json({msg:"there is no user"})}
    
   return res.status(200).json({
  posts: user.posts,                        
  postsCount: user.posts.length,           
  followersCount: user.followers.length,     
  followingCount: user.following.length       
});
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

const follow = async(req,res)=>{
    const userID =req.params.userId

    if(!userID){
        return res.status(400).json({msg:"Please provide a userID to follow"})
    }

    const user = await User.findById(req.user.userID);
    if (!user) {
        return res.status(404).json({ msg: "User not found" });
    }
    const userToFollow = await User.findById(userID);
    if (!userToFollow) {
        return res.status(404).json({ msg: "User to follow not found" });
    } 
    if (user.following.includes(userID)) {
    user.following = user.following.filter(id => id.toString() !== userID);
     await user.save();
    return res.status(200).json({ msg: "Unfollowed successfully", userToFollow }

    );
    }
    else {
    user.following.push(userID);
    await user.save();
    return res.status(200).json({ msg: "Followed successfully", userToFollow });
    }
    

}


module.exports={getMyData,updateUserData,deleteUser,follow}