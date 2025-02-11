const express = require('express')
const router=express.Router()
const passport =require('passport')
const {register,localLogin,logout,googleAuthCallback,googleAuth,forgetPassword,recreatePassword}=require('../controllers/authController')
const {isLoggedIn,verifyToken}=require('../Middleware/authMiddleware')
const upload=require('../config/multer')
//==========================================================================

router.post('/register',upload.single("profileImageURL"),register)

router.post('/localLogin',isLoggedIn ,localLogin)
//================================================================
router.get("/google",isLoggedIn ,googleAuth);

router.get("/google/callback", googleAuthCallback);
//================================================================
router.post('/forgetPassword',forgetPassword)
router.get('/recreatePassword',recreatePassword)
//===========================================after verifyToken==================================
router.use(verifyToken)
router.post('/logout',logout)
//==========================================================================
module.exports=router