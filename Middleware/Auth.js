var jwt=require("jsonwebtoken");

module.exports=function(req,res,next){
  //  console.log(req.headers);
    const token=req.headers['authorization'];
//console.log(token);
    if(token!=null )
    {
        //res.status(401).send("UnAuthorized Access URL")

        try {
            jwt.verify(token,process.env.TOKEN_SECRET)
           next();
            
         } catch (error) {
           //console.log(error);
             res.status(401).send("Invalid JWT Token")
     
         }
    }
    else
    {
        res.status(401).send("UnAuthorized Access URL")

    }

};

