const express = require('express')
const router=express.Router()
const {deleteUser,getUsers,blockUser,getStatistics}=require('../controllers/adminController')

//==============================================================
const {verifyToken,isAdmin}=require('../Middleware/authMiddleware')
router.use(verifyToken)
router.use(isAdmin)

//==========================================================================
router.delete('/deleteUser/:userId',deleteUser)
router.get('/users',getUsers)


router.patch('/blockUser/:userId',blockUser)

router.get('/siteStatistics',getStatistics)

//==========================================================================
module.exports=router