const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    username:{
        type:String
    },
    mobile:Number,
    email:String,
    Profile_Image:JSON,
    password:String,
    works:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'work'
        }
    ],
    date:{
        type:Date,
        default:Date.now
    }
},
{
    
   timestamps: true
    
})
const userModel = mongoose.model('user',userSchema);
module.exports=userModel