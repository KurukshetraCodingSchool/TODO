const mongoose = require('mongoose')
const todoSchema = mongoose.Schema({
    WorkName:String,
    Description:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    }
})
const todoModel = mongoose.model('work',todoSchema);
module.exports=todoModel