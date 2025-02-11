require('dotenv').config()
require('express-async-errors')
const express = require("express")
const app=express()
app.use(express.json())


const cookieParser = require("cookie-parser");
//=======================================connect to database======================
const connectDB=require("./config/database")
connectDB()

//=================
app.get('/home',(req,res)=>{
    res.json({msg:"you are in the home page"})
})
//============

//===============================================================================
app.use(cookieParser())
const cors = require('cors');
app.use(cors(
//     {
//     origin: 'http://localhost:3000', // ضع رابط الفرونت هنا
//     credentials: true // السماح بإرسال الكوكيز
//   }
));



const passport =require('./config/passport')
app.use(passport.initialize())
//=======================================middleware======================


const authRoutes=require('./routes/authRoutes')
app.use('/auth',authRoutes)

const postRoutes=require('./routes/postRoutes')
app.use('/posts',postRoutes)

const userRoutes=require('./routes/userRoutes')
app.use('/users',userRoutes)

const adminRoutes=require('./routes/adminRoutes')
app.use('/admins',adminRoutes)
//======================================================================
require('./Middleware/errorMiddleware')(app)
//=========================================================================
PORT=process.env.port|| 3000
app.listen(PORT ,()=>{
    console.log(`listening on http://localhost:${PORT}`)
})