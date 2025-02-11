const Post=require('../models/Post')
const User=require('../models/User')

const getAllPosts =async (req,res)=>{
    const allPosts= await Post.find().populate('author', 'name profileImageURL')
    return res.json({posts:allPosts})
}

const getPost=async (req,res)=>{
     const {postId}=req.params
    const post= await Post.findById(postId).populate('author', 'name profileImageURL')
    if(!post){
        res.status(404).json({ message: "post not found" });
    }
    return res.json({post:post})
}

const createPost =async (req,res)=>{
    const {title}=req.body
    authorId=req.user.userID
    //===========================================================================
    let imageUrls = []; 
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: "No images uploaded" });
        }
       imageUrls = req.files.map((file) => file.path);
 //===========================================================================

    const newPost= new Post({
        title,
        author:authorId,
        imageUrls
    })
    await newPost.save()
    const user=await User.findById(authorId)
    user.posts.push(newPost._id)
    await user.save();
    res.json({post:newPost})

}

const getUserPosts= async(req,res)=>{
    const {userId}=req.params
    const user=await User.findById(userId).populate('posts')
 if(!user){
        return res.status(404).json({msg:"user not found"})
    }
    console.log(user.posts)
    return res.status(200).json({msg:"success",allPosts:user.posts})
}

const updatePost= async(req,res)=>{
    const userId=req.user.userID
    const {postId}=req.params
    const post =await Post.findById(postId)
    if (!post){return res.status(404).json({msg:"post not found"})}

    if(userId!==post.author.toString()){return res.status(401).json({msg:"you can't update this post"})}

    if (req.files && req.files.length > 0) {
        req.body.imageUrls = req.files.map((file) => file.path);;

    }

    const updatedPost = await Post.findByIdAndUpdate(postId, req.body, { new: true });

    res.status(200).json({ msg: "Post updated successfully", post: updatedPost });

    
}

const deletePost =async(req,res)=>{

    const userId=req.user.userID
    const {postId}=req.params
    const post =await Post.findById(postId)
    if (!post){return res.status(404).json({msg:"post not found"})}

    if(userId!==post.author.toString()&&req.user.role!=="Admin"){return res.status(401).json({msg:"you can't update this post"})}


    const deletedPost = await Post.findByIdAndDelete(postId);

    res.status(200).json({ msg: "Post deleted successfully", deletedPost: deletedPost });
}
//=========================================
const Like=async(req,res)=>{

    const {postId}=req.params
    const post= await Post.findById(postId)
    if(!post){
        res.status(404).json({ message: "post not found" });
    }

const userId=req.user.userID
    if (post.likes.includes(userId)) {
        post.likes = post.likes.filter(id => id.toString() !== userId);
      post.likesCount=post.likes.length
    }else{
    post.likes.push(userId)
    post.likesCount=post.likes.length
    }
    await post.save();
    res.status(200).json({ post:post});
    }

//==========================================
const addComment =async(req,res)=>{
    const {postId}=req.params
    const userId =req.user.userID
    const {comment}=req.body
    const commentImage =req.file? req.file.path:undefined

    const post = await Post.findByIdAndUpdate(postId, {   $push: { comments: { userid: userId, comment,commentImage } }},{ new: true });
   if(!post){return res.status(404).json({msg:"post not found"})}
   res.status(200).json({msg:"Comment added successfully",post:post})
}


const deleteComment=async(req,res)=>{

    const {commentId}=req.params
    const userId=req.user.userID
    //============================================
           const post = await Post.findOne({ "comments._id": commentId });
           if (!post) {return res.status(404).json({msg:"1: comment not found"})}
   
           
           const comment = post.comments.find(c => c._id.toString() === commentId);
           if (!comment) {return res.status(404).json({msg:"2: comment not found"})}
   
          
           if (post.author.toString() !== userId && comment.userid.toString() !== userId&&req.user.role!=="Admin") {return res.status(401).json({msg:"you can't update this post"})}
      //============================================
        
   
    
    const postAfter=await Post.findOneAndUpdate(
        { "comments._id": commentId }, 
        { $pull: { comments: { _id: commentId } } }, 
        { new: true } 
    )
    
    res.status(200).json({ msg: "comment deleted successfully", postAfter: postAfter });
}

const updateComment =async(req,res)=>{
    const userId=req.user.userID
    const {commentId}=req.params
    const {comment}=req.body
//=================================check======================================
    const post = await Post.findOne({ "comments._id": commentId });
    if (!post) {return res.status(404).json({msg:"1: comment not found"})}

    
    const commentToUpdate = post.comments.find(c => c._id.toString() === commentId);
    if (!commentToUpdate) {return res.status(404).json({msg:"2: comment not found"})}

   
    if (commentToUpdate.userid.toString() !== userId) {return res.status(401).json({msg:"you can't update this post"})}
//=======================================================================
const imageUrl=req.file?req.file.path:undefined

        const postAfter=await Post.findOneAndUpdate(
        { "comments._id": commentId }, 
        {
        $set: { 
            "comments.$.comment": comment || commentToUpdate.comment, // تحديث النص إذا وُجد
            "comments.$.commentImage": imageUrl || commentToUpdate.commentImage // تحديث الصورة إذا وُجدت
        }
    },
        { new: true } 
    )

    res.status(200).json({ msg: "Post updated successfully", post: postAfter });

}
//=============================================
module.exports={getAllPosts,createPost,Like,getPost,getUserPosts,addComment,updatePost,deletePost,deleteComment,updateComment}


// const getUsersLiked=async(req,res)=>{
//     const {postId}=req.body
//     const post= await Post.findById(postId)
//     if(!post){
//         res.status(404).json({ message: "post not found" });
//     }
//     const likes=post.likes
//     return res.json({usersLikes:likes})
// }

