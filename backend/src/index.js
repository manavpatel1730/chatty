// const express = require('express');
import {connectDB} from "./lib/db.js"
import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import path from "path"
import { app,server } from "./lib/socket.js"

dotenv.config()
// const app = express()
const PORT =process.env.PORT
const __dirname = path.resolve()


app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use(cookieParser())
app.use(cors({origin:process.env.CLIENT_URL,credentials:true})) 



app.use("/api/auth",authRoutes)
app.use("/api/messages",messageRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/build")))
    app.get("*",(req,res)=>{
        res.sendFile(path.resolve(__dirname,"../frontend","dist","index.html"))
    })
}


server.listen(PORT,()=>{
    console.log(`server is runnning on the ${PORT}`)
    connectDB()
}) 