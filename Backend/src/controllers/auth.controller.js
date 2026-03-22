const express = require("express");
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const registerController = async(req,res)=>{
    const {username,email,password,bio,profileImage} = req.body;

     const isUserExists = await userModel.findOne({
        $or:[
            {username},
            {email}
        ]
     })

     if(isUserExists){
        return res.status(409).json({
            message:"user already exists"
        })
     }

     const hash = await bcrypt.hash(password, 10);

     const user = await userModel.create({
          username,
          email,
          bio,
          profileImage,
          password:hash
     })

     const token = jwt.sign({
       id:user._id,
       username:user.username
     },process.env.JWT_SECRET,{expiresIn:"7d"})

     res.cookie("token",token);

    return res.status(201).json({
        message:"user registered successfully",
        user:{
            username:user.username,
            email:user.email,
            bio:user.bio,
            profileImage:user.profileImage
        }
     })


}

const loginController = async(req,res)=>{
  const {username,email,password} = req.body;

  const user = await userModel.findOne({
    $or:[
        {username},
        {email}
    ]
  }).select("+password")

  if(!user){
    return res.status(404).json({
        message:"user not found"
    })
  }

  const isPasswordValid = await bcrypt.compare(password,user.password);

  if(!isPasswordValid){
    return res.status(401).json({
        message:"invalid password"
    })
  }

  const token = jwt.sign({
    id:user._id,
    username:user.username
  },process.env.JWT_SECRET,{expiresIn:"7d"})

  res.cookie("token",token);

  return res.status(200).json({
    message:"user login successfully",
    user:{
        username:user.username,
        email:user.email,
        bio:user.bio,
        profileImage:user.profileImage
    }
  })
}

const getMeController = async(req,res)=>{
   const userId = req.user.id;

   const user = await userModel.findById(userId)

   return res.status(200).json({
    user:{
      username:user.username,
      email:user.email,
      bio:user.bio,
      profileImage:user.profileImage
    }
   })
}





module.exports = {
    registerController, loginController , getMeController
}
