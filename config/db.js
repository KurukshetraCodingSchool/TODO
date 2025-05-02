const mongoose = require('mongoose')
const todo = mongoose.connect('mongodb://0.0.0.0/Todo').then(()=>{
    console.log('db connected successfully');
})
module.exports = todo