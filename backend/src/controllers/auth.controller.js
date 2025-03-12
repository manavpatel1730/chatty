import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

export const signup =async(req,res)=>{
    const {fullName,email,password} =req.body
try {

    if(!fullName || !email || !password){
        return res.status(400).json({
            message:"All fields are required"
        })
    }

    if(password.length <6){
        return res.status(400).json({
            message:"password must be at least 6 charcters"
        })
    }

const user = await User.findOne({email})
if(user){
   return res.status(400).json({
        message:"email already exists"
    })
}

const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password,salt)
    const newuser = new User({
        fullName,
        email,
        password:hashedPassword
    })

    if(newuser){
generateToken(newuser._id,res)
await newuser.save()
res.status(201).json({
    _id:newuser._id,
    fullName:newuser.fullName,
    email:newuser.email,
    profilePic:newuser.profilePic,
})
    }
    else{
        res.status(400).json({
            message:"Invalid user data"
        })
    }

} catch (error) {
    console.log("error in signup controller",error.message)
    res.status(500).json({
        message:"Internal server error"
    })
    
}   
}
export const login = async(req,res)=>{
    const {email,password} = req.body
   try {
    const user= await User.findOne({email})
    if(!user){
        return res.status(400).json({
            message:"Invalid credentials"
        })
    }

  const isPasswordCorrect =  await bcrypt.compare(password,user.password)
    if(!isPasswordCorrect){
        return res.status(400).json({
            message:"Invalid credentials"
        })
    }
  console.log("user",user._id)
    generateToken(user._id,res)

    res.status(200).json({
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profilePic:user.profilePic
    })

   } catch (error) {
    console.log("error in login controller",error.message)
    res.status(500).json({
        message:"Internal server error"
    })
    
   }
}
export const logout =(req,res)=>{
    try {
        
        res.cookie("jwt","",{maxAge:0})
        res.status(200).json({
            message:"Logged out successfully"
        })

    } catch (error) {
        
        console.log("error in logout controller",error.message)
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const updateProfile =async (req,res)=>{
    try {
        const {profilePic}=req.body
     const userId= req.user._id
     if(!profilePic){
            return res.status(400).json({
                message:"profilePic is required"
            })
     }
   const uploadUser=  await cloudinary.uploader.upload(profilePic)
   const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadUser.secure_url},{new:true})

   res.status(200).json(updatedUser)
        
    } catch (error) {
        console.log("error in updateProfile controller",error.message)
       return res.status(500).json({
            message:"Internal server error"
        })
    }


}

export const checkAuth = (req,res)=>{
    try{
        res.status(200).json(req.user)
    }
    catch(error){
        console.log("error in checkAuth controller",error.message)
        res.status(500).json({
            message:"Internal server error"
        })
    }

}

