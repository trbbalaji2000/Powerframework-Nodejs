var mongo=require("mongoose")

const UserCollection=mongo.Schema({

    Name:{  
        type:String,
        require:true,
    },
    Email:{
        type:String,
        require:true
    },
    Password:{
        type:String,
        require:true
    },
    Role:{
        type:String,
        require:true
    }
})

module.exports=mongo.model('Users',UserCollection);