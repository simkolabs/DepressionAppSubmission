const FacebookPost = require('../models/facebookPost')

exports.savePostsResults = (req,res) => {
    const {post,result,userId} = req.body

    if(post===null||result===null||userId===null){
        res.json({Status: "Unsuccessful", Message: "All the data must be entered."})
    }else{
        const newFBPost = new FacebookPost({
            user:userId,
            post:post,
            result:result
        })

        newFBPost.save()
            .then(result2=>{
                res.json({
                    Status: "Successful",
                    Message: 'Facebook Post has been recorded successfully.',
                    Session: result2
                })
            })
            .catch(error=>{
                res.json({
                    Status: "Unsuccessful",
                    Message: "Happened saving the record in " +
                        "DB.",
                    error: error
                })
            })
    }
}

exports.getFacebookResults = (req,res) => {
    const {userId} = req.body
    if(userId===""){
        res.json({Status: "Unsuccessful", Message: "User Id must be entered."})
    }else{
        FacebookPost.find({user:userId})
            .then(posts=>{
                res.json({
                    Posts:posts
                })
            })
    }
}