const bcrypt = require("bcrypt");
require("dotenv").config();
const sendWelcomeEmail = require('../emails/emailHandlers');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const generateToken = require('../utils/generateToken'); 
const cloudinary = require("../lib/cloudinary");


const signup = async (req, res, next) => {
  try {
    const { fullname, email, password } = req.body;


    //  Check all fields
    if (!fullname || !email || !password) {
      return next(new AppError('All fields are required', 400));
    }

    //  Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('User already exists', 400));
    }

    // hashedPassword before save to db

    const hashedPassword = await  bcrypt.hash(password,Number(process.env.SALT))

    //  Create new user instance
    const newUser = new User({
        fullname,
      email,
      password:hashedPassword,
      profilePic: req.body.profilePic || '', // optional
    });

    // Save user to DB
    const savedUser = await newUser.save();

    if (!savedUser) {
      return next(new AppError('Error saving user, please try again', 500));
    }

    //  Generate JWT token and set cookie
    generateToken(savedUser._id, res);

    // Send response
    res.status(201).json({
      status: 'success',
      message: 'User created successfully',
      user: {
        _id: savedUser._id,
        fullName: savedUser.fullname,
        email: savedUser.email,
        profilePic: savedUser.profilePic,
      },
    });
    try {
        await sendWelcomeEmail(savedUser.email, savedUser.fullname, process.env.CLIENT_URL);
      } catch (error) {
        console.error("Failed to send welcome email:", error);
      }

  } catch (error) {
    next(error); 
  }
};

const login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
  
      //  Validate input
      if (!email || !password) {
        return next(new AppError("Please provide email and password", 400));
      }
  
      //  Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return next(new AppError("Invalid email or password", 401));
      }
  
      // Compare password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        return next(new AppError("Invalid email or password", 401));
      }
  
      //  Generate JWT token
      generateToken(user._id, res);
  
      //  Send success response
      res.status(200).json({
        status: "success",
        message: "Login successful",
        user: {
          _id: user._id,
          fullName: user.fullName,
          email: user.email,
          profilePic: user.profilePic,
        },
      });
    } catch (error) {
      next(error); // pass to global error handler
    }
  };

  const logout = (_,res)=>{
    res.cookie("jwt","",{maxAge:0});
    res.status(200).json({message:"Logged out sucessfully"});
  }

 
const updateProfile = async (req, res, next) => {
    try {
    const profilePic = req.body;
    
    
      //  Validate input
      if (!profilePic) {
        return next(new AppError("Profile picture is required", 400));
      }
  
      const userId = req.user._id;
  
      //  Upload to Cloudinary
      const uploadResp = await cloudinary.uploader.upload(profilePic, {
        folder: "chatify_profile_pics",
      });
  
      if (!uploadResp || !uploadResp.secure_url) {
        return next(new AppError("Image upload failed", 500));
      }
  
      //  Update user in DB
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: uploadResp.secure_url },
        { new: true, select: "-password" }
      );
  
      if (!updatedUser) {
        return next(new AppError("User not found", 404));
      }
  
      //  Send response
      res.status(200).json({
        status: "success",
        message: "Profile picture updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      next(error);
    }
  };
module.exports = { signup,login,logout,updateProfile};
