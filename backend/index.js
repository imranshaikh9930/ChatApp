const express  = require("express");
const connectDb = require("./lib/connectDb");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const cookieParser = require("cookie-parser");

require("dotenv").config();


const app = express();


const PORT = process.env.PORT || 5500
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);
app.listen(PORT,()=>{

    console.log(`Server is Running on Port ${PORT}`);
    connectDb();
  
})

app.use(errorHandler);