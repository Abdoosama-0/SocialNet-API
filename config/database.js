require('dotenv').config()
const mongoose=require('mongoose')
const connectDB=async()=>{
    try{
        await
mongoose.connect(process.env.mongoURI)
console.log("✅ Connected to database ")

}catch(error){
    console.log("connection failed")
}
}
module.exports=connectDB