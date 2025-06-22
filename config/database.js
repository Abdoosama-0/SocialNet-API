require('dotenv').config();

const mongoose = require('mongoose');
const connectDB=async()=>{
    try{
        await
mongoose.connect(process.env.MONGODB_URI)
console.log("✅ Connected to database ")

}catch(error){
    console.log("❌ connection failed\n" , error.message);
}
}
connectDB(); 

// write require('./config/database')  in server.js to connect to the database