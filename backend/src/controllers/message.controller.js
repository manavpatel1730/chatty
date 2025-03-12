import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"
import Message from "../models/messege.model.js"
import User from "../models/user.model.js"

export const getUsersForSidebar = async(req,res)=>{
    try {
        const loggedInUserId = req.user._id
        const filterdUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password")
        res.status(200).json(filterdUsers)
    } catch (error) {
        console.log("error in getUsersForSidebar controller",error.message)
       return res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const getMessages = async(req,res)=>{

    try {
        const {id:userToChatId} = req.params
    const myId = req.user._id

    const messages = await Message.find({
        $or:[
           {senderId:myId,receiverId:userToChatId},
              {senderId:userToChatId,receiverId:myId}
        ]
    })

    res.status(200).json(messages)

        
    } catch (error) {
        console.log("error in getMessages controller",error.message)
        res.status(500).json({
            message:"Internal server error"
        })
        
    }
    

}

export const sendMessages =async(req,res)=>{
    try {
        const {text,image} = req.body
        const {id:receiverId} = req.params
        const senderId = req.user._id
        let imageUrl;
       if(image){
        const uploadResponse = await cloudinary.uploader.upload(image)
        imageUrl = uploadResponse.secure_url
       }
    
    const newMessage = new Message({
        senderId,
        receiverId,
        text,
        image:imageUrl
    })

    await newMessage.save()
    res.status(200).json(newMessage)

  
    const ReceiverSocketId = getReceiverSocketId(receiverId)
    if(ReceiverSocketId){
        io.to(ReceiverSocketId).emit("newMessage",newMessage)
    }
    
    } catch (error) {
        console.log("error in sendMessages controller",error.message)
        res.status(500).json({
            message:"Internal server error"
        })
    }

}