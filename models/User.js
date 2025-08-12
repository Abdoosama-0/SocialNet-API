const mongoose=require('mongoose')
const Schema=mongoose.Schema
const bcrypt =require('bcrypt')
const validator = require("validator");

const userSchema=new Schema({
    profileImageURL:{
        type:String,
        default:"https://res.cloudinary.com/dnrwv3xif/image/upload/v1739109413/images_eb1suu.png"
    },
    // googleId:{
    //     type:String
    // },

  name:{
      type:String,
      require:true
      
  },
  email:{
      type:String,
      require:true,
      unique:true
  },

  username:{
    type:String,
    require:true,
    unique:true
  },

  password:{
      type:String,
      require:true,
  },
  role:{
      type:String,
      enum:["User","Admin"],
      default:"User"
  },
  posts: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }], 
    default: [] 
  },
  isBanded:{
    type:Boolean,
    default:false
  },
  followers: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: []
  },
  following: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: []
  }
  
},
{ timestamps: true })
userSchema.methods.verifyPassword = async function(password){
    return await bcrypt.compare(password,this.password)
}
const User =mongoose.model('User',userSchema)
module.exports=User