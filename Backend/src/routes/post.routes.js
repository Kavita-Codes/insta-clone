const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/post.controller")
const multer = require("multer");
const storage = multer.memoryStorage()
const upload = multer({ storage: storage });
const identifyUser = require("../middleware/auth.middleware")


postRouter.post("/" ,upload.single("image"), identifyUser, postController.createPostController)
postRouter.get("/",identifyUser, postController.getPostController)   // protected route /api/posts/
postRouter.get("/details/:postId",identifyUser, postController.getPostDetails)  // jo post id denge uska post dega jo uss user ne create kari hogi
postRouter.get("/feed",identifyUser, postController.getFeedController)
postRouter.post("/like/:postId",identifyUser,postController.likePostController)

module.exports = postRouter;