require('dotenv').config()
require('express-async-errors')
const express = require("express")
const app=express()
app.use(express.json())

const redis = require("./config/redis") 
redis.set("testKey1", "hello world")
const cookieParser = require("cookie-parser");

require('./config/database') 


//============
app.get('/',(req,res)=>{
    res.json({msg:"hello in SocialNet-API"})
})
//===============================================================================
app.use(cookieParser())
const cors = require('cors');

app.use(cors({
     origin: (origin, callback) => {
    callback(null, true); // السماح بأي origin
  },
    credentials: true,
  }));



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