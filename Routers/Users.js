var app=require("express").Router()
var UserCollection=require('../Models/User');
var Cryptr=require("cryptr");
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();
const Auth=require("../Middleware/Auth")

const cryptr = new Cryptr('myTotalySecretKey');
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
        const payload={
            email:req.body.email
        }
     const DataStore=await UserData.save()
     //  jwt.sign(payload,process.env.TOKEN_SECRET,{expiresIn:'120s'},(err,token)=>{
        jwt.sign(payload,process.env.TOKEN_SECRET,(err,token)=>{
         
     if (err)  throw err
        res.send(token)
       })     
       
    }
    else
    {
        res.send("Already Account Is Created")
    }

})


app.post('/userlogin',Auth,async(req,res)=>{
    const {email,password}=req.body;
//console.log(req.body.email)
    UserCollection.findOne({Email:email},(err,data)=>{
       
        if(!data)
        {
            res.send("Email Is Not Found Please Create Account")
        }
        else
        {
            const decrypt=cryptr.decrypt(data.Password)
         
            if(password!=decrypt)
            {
                res.send("Password is MissMatch Please Check Password")
            }
            else
            {
                res.send("Welcome")
            }
        
        }
    
    })
    
})



module.exports=app;