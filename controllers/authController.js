require('dotenv').config()
const User = require('../models/User')
const passport = require('passport')

const bcrypt = require('bcrypt')
const validator = require('validator');
const crypto = require("crypto");
//=========================================
const jwt = require('jsonwebtoken')
const redis = require('../config/redis')
const nodemailer = require("nodemailer");
//=========================================================================

const localLogin = (req, res, next) => {
  passport.authenticate('local', { session: false }, async (err, user, info) => {
    if (err) return res.status(500).json({ message: "Server error", error: err })
    if (!user) return res.status(401).json({ message: info?.message || "Invalid username or password" })
    if (user.isBanded === true) { return res.status(401).json({ msg: "sorry, admin banded you" }) }

    const Payload = { userID: user._id.toString(), role: user.role }
    const accessToken = jwt.sign(Payload, process.env.SECRET_TOKEN, { expiresIn: "1h" });
    const refreshToken = jwt.sign(Payload, process.env.SECRET_TOKEN);
    await redis.set(`refresh:${user._id.toString()}`, refreshToken);
    res.cookie("access_token", accessToken, { httpOnly: true, secure: false, });

    return res.json({ msg: 'logged in successfully', userData: user, accessToken, refreshToken });
  })(req, res, next)
}

//=========================================================================
const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });
//----------
const googleAuthCallback = async (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({ message: "Google authentication failed" });
    }



    //==========================================
    const Payload = { userID: user.user._id.toString(), role: user.user.role }
    const accessToken = jwt.sign(Payload, process.env.SECRET_TOKEN, { expiresIn: "1h" });
    const refreshToken = jwt.sign(Payload, process.env.SECRET_TOKEN);
    await redis.set(`refresh:${user.user._id.toString()}`, refreshToken);
    res.cookie("access_token", accessToken, { httpOnly: true, secure: false, });
    //==========================================
    return res.redirect('/')



  })(req, res, next);
};
//=========================================================================
const logout = async (req, res) => {


  res.clearCookie("access_token");
  await redis.del(`refresh:${req.user.userID}`);
  res.status(200).json({ msg: "Logged out successfully" })


}
//=========================================================================

const register = async (req, res) => {
  const { name, email, username, password } = req.body
  //===================================================================check email=============================================
  //is email valid
  if (!validator.isEmail(email)) {
    return res.status(400).json({ msg: "this is not an email" })
  }
  //is email already token
  const emailisExists = await User.findOne({ email: email })
  if (emailisExists) {
    return res.status(400).json({ msg: "this email is already used" })
  }
  //===================================================================check username=============================================
  //is username already token
  const usernameisExists = await User.findOne({ username: username })
  if (usernameisExists) {
    return res.status(400).json({ msg: "this username is already used" })
  }
  //===================================================================check password=============================================
  if (!validator.isStrongPassword(password)) {
    return res.status(400).json({ msg: "Password must be at least 8 characters long and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character." })
  }


  //================================================================================================================
  const profileImageURL = req.file ? req.file.path : undefined;
  const hashed = await bcrypt.hash(password, 10)

  const otp = crypto.randomInt(100000, 999999).toString();

  await redis.set(`OTP:${email}`, JSON.stringify({
    otp,
    name,
    username,
    email,
    password: hashed,
    expire: Date.now() + 5 * 60 * 1000
  }), 'EX', 300);


  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    text: `Your verification code is: ${otp}`
  });
  //================================================================================================================

  res.json({ msg: "OTP sent to your email. Please verify to complete registration." });

}

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const userDataB = await redis.get(`OTP:${email}`);
  if (!userDataB) {
    return res.status(400).json({ msg: "OTP expired or not found" });
  }
  const userData = JSON.parse(userDataB);
  if (Date.now() > userData.expire) {
    delete pendingUsers[email];
    return res.status(400).json({ msg: "OTP expired. Please register again." });
  }

  if (userData.otp !== otp) {
    return res.status(400).json({ msg: "Invalid OTP" });
  }


  const newUser = new User({
    name: userData.name,
    email: userData.email,
    username: userData.username,
    password: userData.password
  });
  await newUser.save();


  await redis.del(`OTP:${email}`); // Clear OTP after successful verification

  res.json({ msg: "Email verified and registration completed successfully. Please login." });
};


//=========================================================================
const { sendEmailWithLink } = require('../config/mailer')
const forgetPassword = async (req, res) => {
  const { email } = req.body
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  const token = crypto.randomBytes(32).toString("hex");
await redis.set(
  `reset:${token}`,
  email,
  'EX',
  60 * 3 
);



  const subject = "Reset password";
  const linkText = "click here to Reset password";
  const linkUrl = `http://localhost:3000/auth/recreatePassword?token=${token}`;

  const response = await sendEmailWithLink(email, subject, linkText, linkUrl);

  if (response.success) {
    return res.status(200).json({ msg: "Email sent successfully. If you do not see it in your inbox, please check your spam or junk folder." });
  } else {
    return res.status(500).json({ error: "Failed to send email", error: response.error });
  }
}

const recreatePassword = async (req, res) => {
  const { token } = req.query;
  if (!token) {
    return res.status(400).json({ error: "Token is required" });
  }
  const email = await redis.get(`reset:${token}`);
  if (!email) {
    return res.status(400).json({ error: "Invalid or expired token" });
  }


  const { newPassword } = req.body


  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ msg: "Email not found" });
  }

  //===================================================================check password=============================================
  if (!validator.isStrongPassword(newPassword)) {
    return res.status(400).json({ msg: "Password must be at least 8 characters long and include at least 1 lowercase letter, 1 uppercase letter, 1 number, and 1 special character." })
  }
  //================================================================================================================
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;
  await user.save();
  await redis.del(`reset:${token}`); 

  return res.status(200).json({ msg: "password recreated successfully, go back to login page" })

}
//=========================================================================

module.exports = { register, localLogin, logout, googleAuth, googleAuthCallback, forgetPassword, recreatePassword, verifyOtp }