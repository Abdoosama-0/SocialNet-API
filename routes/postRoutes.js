const express = require('express')
const router=express.Router()
const {getAllPosts,createPost,Like,getPost,getUserPosts,addComment,updatePost,deletePost,deleteComment,updateComment}=require('../controllers/postController')
const upload=require('../config/multer')
//==========================================================================
const {verifyToken}=require('../Middleware/authMiddleware')
router.use(verifyToken)// ensure that you are logged in before accessing any of the routes
//==========================================================================

router.get('/posts',getAllPosts)


router.post('/addPost', upload.array("images", 5), createPost);

router.get('/:postId',getPost)

router.get('/userPosts/:userId',getUserPosts)

router.patch('/:postId', upload.array("images", 5), updatePost);

router.delete('/:postId',deletePost)
//===================================================
router.post('/Like/:postId',Like)
//===================================================
router.post('/addComment/:postId',upload.single("commentImage"),addComment)
router.delete('/deleteComment/:commentId',deleteComment)
router.patch('/updateComment/:commentId', upload.single("commentImage"),updateComment)
//==========================================================================
module.exports=router