const express = require('express')
const router=express.Router()
const {getMyData,updateUserData,deleteUser,follow}=require('../controllers/userController')

//==============================================================
const {verifyToken}=require('../Middleware/authMiddleware')
router.use(verifyToken)
//==========================================================================
router.get('/me',getMyData)

const upload=require('../config/multer')
router.patch('/me',upload.single("profileImageURL"),updateUserData)


router.delete('/me',deleteUser)

router.post('/:userId/follow',follow)



//==========================================================================
module.exports=router