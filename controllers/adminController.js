require('dotenv').config()
const User=require('../models/User')
const Post=require('../models/Post')
//=========================================
const moment=require('moment')
const redis=require('../config/redis')

//=========================================================================

const deleteUser=async(req,res)=>{
const {userId}=req.params

const user =await User.findByIdAndDelete(userId)
if(!user){ return res.status(404).json({msg:"there is no user"})}
await redis.del(`refresh:${userId}`);
return res.status(200).json({msg:"user deleted successfully",user:user})
}


const getUsers=async(req,res)=>{
const users=await User.find()
console.log(users)
if(!users){return res.status(404).json({msg:"there is no users"}) }
return res.status(200).json({msg:"success",allUsers:users})
}

const blockUser=async(req,res)=>{
    const {userId} =req.params

    const user = await User.findById(userId);
    if (!user) {
        return res.status(404).json({ msg: "There is no user" });
    }
    
    const updatedUser =await User.findByIdAndUpdate(userId,{isBanded:!user.isBanded},{new:true})
    return res.status(200).json({ msg: "user banded successfully", updatedUser});


}

const getStatistics =async (req,res)=>{
    
    const totalUsers = await User.countDocuments(); 
    const totalPosts = await Post.countDocuments();
    const blockedUsers = await User.countDocuments({ isBlocked: true }); 
    const activeUsers = totalUsers - blockedUsers; 
    const admins = await User.countDocuments({ role: "Admin" }); 


    const newUsersLastWeek = await User.countDocuments({ 
        createdAt: { $gte: moment().subtract(7, "days").toDate() } 
    }); // new users last 7 days





    res.status(200).json({
        totalUsers,
        blockedUsers,
        activeUsers,
        admins,
        newUsersLastWeek,
        totalPosts,
    });
}
//=======================================================
module.exports={deleteUser,getUsers,blockUser,getStatistics}