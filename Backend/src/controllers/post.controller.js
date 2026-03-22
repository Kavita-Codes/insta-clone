const postModel = require("../models/post.model");
const { toFile } = require("@imagekit/nodejs");
const ImageKit = require("@imagekit/nodejs");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")
const likeModel = require("../models/like.model")

const client = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY 
});

async function createPostController(req,res){

   const file = await client.files.upload({
    file: await toFile(Buffer.from(req.file.buffer), 'file'),
    fileName: "image"   
                          //folder:"cohort 2"

     });

    const post = await postModel.create({
        caption:req.body.caption,
        imgUrl:file.url,
        user:req.user.id
    })

    res.status(201).json({
        message:"post created successfully",
        post
    })
}

async function getPostController(req,res){

         const userId = req.user.id;

         const posts = await postModel.find({
            user:userId
         })

         return res.status(200).json({
           message:"post fetched successfully",
            posts
         })
        
         
          


}

async function getPostDetails(req,res){
   

   const userId = req.user.id;
   const postId = req.params.postId;

   const post = await postModel.findById(postId)

   if(!post){
    return res.status(404).json({
        message:"post not found"
    })
   }

   const isValidUser = post.user === userId

   if(!isValidUser){
    return res.status(403).json({
        message:"forbidden content"
    })
   }

   return res.status(200).json({
    message:"post fetched successfully",
    post
   })
}

async function getFeedController(req,res){
    const posts = await Promise.all(postModel.find().populate("user").lean())    //populate lagane se jo res me keval user ki id aa rahi thi ab vaha par pura user ka data aayega

    .map(async (post)=>{

        const isLiked = await likeModel.findOne({
            user:user.username,
            post:post._id
        })
         post.isLiked = Boolean(isLiked);
         return post;
    })  

    return res.status(200).json({
        message:"posts fetched successfully",
        posts
    })
}

async function likePostController(req,res){
      const username = req.user.username;
    const  postId = req.params.postId;

    const post = await postModel.findById(postId)

    if(!post){
        return res.status(404).json({
            message:"post not found"
        })
    }

    const like = await likeModel.create({
        post:postId,
        user:username
    })

    return res.status(200).json({
        message:"post liked successfully",
        like
    })
}

module.exports = {
     createPostController , getPostController , getPostDetails , getFeedController, likePostController
}