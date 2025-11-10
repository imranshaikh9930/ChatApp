const jwt = require("jsonwebtoken");


const generateToken = (userId,res)=>{

    console.log("process.env.SECRET_KEY",process.env.SECRET_KEY);
    const token = jwt.sign({userId},process.env.SECRET_KEY,{
        expiresIn:"7d"
    });

    res.cookie("jwt",token,{
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly:true,
        sameSite:"strict",
        
    })

    return token;
}

module.exports = generateToken;