const jwt = require("jsonwebtoken")

async function identifyUser(req,res,next){
  const token = req.cookies.token;
  
     if(!token){
      return res.status(401).json({
          message:"token not provided"
      })
     }
  
     let decoded;
  
     try {
        decoded = jwt.verify(token,JWT_SECRET);
  
     } catch (error) {
         return res.status(401).json({
          message:"user unathorized"
         })
     }

     req.user = decoded;

     next();

}

module.exports = identifyUser;