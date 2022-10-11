const mongoose = require('mongoose')
const postsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Users'
    },
    post: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    result:{
        type:String,
        required:true
    }
})


module.exports = mongoose.model('FacebookPosts', postsSchema)