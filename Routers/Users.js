var app=require("express").Router()
var UserCollection=require('../Models/User');
var Cryptr=require("cryptr");
const jwt = require('jsonwebtoken');
const Auth=require("../Middleware/Auth")
const cryptr = new Cryptr('myTotalySecretKey');


app.get('/user/auth',Auth,async(req,res)=>{
    try {
		const user = await UserCollection.findById(req.user.id).select("-Password");
    
		res.json(user);
	} catch (err) {
		console.error(err.message);
		res.status(500).send("Server Error");
	}
})


app.post('/user',async(req,res)=>{


    const finduser=await UserCollection.findOne({Email:req.body.email})
  //  console.log(finduser);
    if(!finduser)
    {
       
        const  encrypt=cryptr.encrypt(req.body.password)
        const UserData= new UserCollection({
            Name:req.body.name,
            Email:req.body.email,
            Password:encrypt,
            Role:req.body.role
        })
        
     const DataStore=await UserData.save()
     const payload={
        // email:req.body.email
        user:{
            id:UserData.id
        }
    }

     //  jwt.sign(payload,process.env.TOKEN_SECRET,{expiresIn:'120s'},(err,token)=>{
        jwt.sign(payload,process.env.TOKEN_SECRET,(err,token)=>{
         
     if (err)  throw err
        res.json({ token });
        
       })     
       
    }
    else
    {
        res.status(400).json({ msg: "User already exists" });
    }

})


app.post('/userlogin',async(req,res)=>{
    const {email,password}=req.body;
    UserCollection.findOne({Email:email},(err,data)=>{
      
        if(!data)
        {
            res.status(400).json({  msg: "Invalid Email Id" });
        }
        else
        {
            const decrypt=cryptr.decrypt(data.Password)
         
            if(password!=decrypt)
            {
                res.status(400).json({  msg: "Invalid Passoword"  });
            }
            else
            {
                const payload={
                    user:{
                        id:data.id
                    }
                }
                jwt.sign(payload,process.env.TOKEN_SECRET,(err,token)=>{
     
                    if (err)  throw err
                     res.json({token})
                      })   
            }
        
        }
    
    })
    
})



module.exports=app;