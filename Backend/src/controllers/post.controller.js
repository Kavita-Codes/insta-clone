const postModel = require("../models/post.model");
const { toFile } = require("@imagekit/nodejs");
const ImageKit = require("@imagekit/nodejs");
const cookieParser = require("cookie-parser")
const jwt = require("jsonwebtoken")

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

module.exports = {
     createPostController , getPostController , getPostDetails
}