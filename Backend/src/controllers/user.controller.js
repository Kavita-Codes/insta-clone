const followModel = require( "../models/follow.model");
const userModel = require("../models/user.model")

const followUserController = async(req,res)=>{

    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;

    if(followerUsername == followeeUsername){
        return res.status(400).json({
            message:"you cannot follow yourself"
        })
    }

    const isFolloweeExists = await userModel.findOne({
        username:followeeUsername
    })

    if(!isFolloweeExists){
        return res.status(404).json({
            message:"user you are trying to follow does not exists"
        })
    }
  
    const isAlreadyfollowing = await followModel.findOne({
       follower:followerUsername,
       followee:followeeUsername
    })

    if(isAlreadyfollowing){
        return res.status(200).json({
            message:`you already following ${followeeUsername}`,
            follow:isAlreadyfollowing
        })
    }

    const followRecord = await followModel.create({
        follower:followerUsername,
        followee:followeeUsername
    })

    res.status(201).json({
       message:`you are now following ${followeeUsername}`,
       follow:followRecord
    })
    
}

const unfollowUserController = async(req,res)=>{
    const followerUsername = req.user.username;
    const followeeUsername = req.params.username;

    const isUserfollowing = await followModel.findOne({
       follower:followerUsername,
       followee:followeeUsername
    })

    if(!isUserfollowing){
      return res.status(200).json({
        message:`you are not following ${followeeUsername}`
      })
    }

    await followModel.findByIdAndDelete(isUserfollowing._id)

    return res.status(200).json({
        message:`you unfollowed ${followeeUsername}`
    })
}

module.exports = {followUserController , unfollowUserController};