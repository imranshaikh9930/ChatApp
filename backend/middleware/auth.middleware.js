
const User = require("../models/User");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const protectRoute = async(req,res,next)=>{

    try {
        const token = req.cookies.jwt;

        
        console.log("token",token)
        if(!token){
            return next(new AppError("Unauthorized",401));
        }

        const decoded = jwt.verify(token,process.env.SECRET_KEY)

        console.log("decoded",decoded);
        if(!decoded){
            return next(new AppError("Unauthorized",401));

        }
        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            return next(new AppError("User not Found",404));
        }

        req.user = user;
        next();


    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return next(new AppError("Token expired. Please log in again.", 401));
          }
          if (error.name === "JsonWebTokenError") {
            return next(new AppError("Invalid token. Please log in again.", 401));
          }
      
          next(error);
    }
}

module.exports = protectRoute;





 


