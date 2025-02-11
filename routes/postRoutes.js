const express = require('express')
const router=express.Router()
const {getAllPosts,createPost,Like,getPost,getUserPosts,addComment,updatePost,deletePost,deleteComment,updateComment}=require('../controllers/postController')
const upload=require('../config/multer')
//==========================================================================
const {verifyToken}=require('../Middleware/authMiddleware')
router.use(verifyToken)
//==========================================================================

router.get('/posts',getAllPosts)


router.post('/post', upload.array("images", 5), createPost);

router.get('/:postId',getPost)

router.get('/userPosts/:userId',getUserPosts)

router.patch('/post/:postId', upload.array("imageUrls", 5), updatePost);

router.delete('/post/:postId',deletePost)
//===================================================
router.post('/Like/:postId',Like)
//===================================================
router.post('/addComment/:postId',upload.single("commentImage"),addComment)
router.delete('/deleteComment/:commentId',deleteComment)
router.patch('/updateComment/:commentId', upload.single("commentImage"),updateComment)
//==========================================================================
module.exports=router