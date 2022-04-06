var express=require("express");
var app=express();
var bodyparser=require("body-parser")
var mongo=require("mongoose")
var cors=require("cors");
const dotenv = require('dotenv');
dotenv.config();
mongo.connect(process.env.DB_CONNECTION,(err)=>{
if(err)
{
    console.log(err);
}
else
{
    console.log("Connected....")
}

})

//var PORT=5000
app.use(cors())
app.use(bodyparser.json())
app.get('/',(req,res)=>{
    res.send("Welcome..")
})

app.use('/api',require('./Routers/Users'))



app.listen(process.env.PORT,()=>{
    console.log("Server Running ON:"+process.env.PORT);
})