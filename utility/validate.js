const User=require('../models/User')
const validator = require('validator');
const isValidEmail = async(email) => {

     if(!validator.isEmail(email)){

      return { valid: false, msg: "This is not a valid email." };

     }
     const emailIsExists=await User.findOne({email:email})
     if(emailIsExists){
     

       return { valid: false, msg: "This email is already used." };


     }
  return { valid: true };

}
module.exports = {
  isValidEmail,}