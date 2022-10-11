const SessionAnswer  = require('../models/sessionAnswers')
const Sessions = require('../models/session')
const axios = require('axios');
const request = require('request-promise');
const FacebookPost = require("../models/facebookPost");

exports.addSessionAnswer =  async  (req,res) => {
    const {user,session,date,video} = req.body
    const PYTHON_API_URL = "";

    const headers = {
        'accept': 'application/json',
        'Content-Type': 'multipart/form-data'
    };

    if(user===""||user===null||session===""||session===null||req.files === null){
        res.json({Status: "Unsuccessful", Message: "All the data must be entered."})
    }else{
        let videoResponse=null;
        var videos = [];

        axios.post(
            'http://127.0.0.1:8000/predict_vido_path/',
            '',
            {
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }
        )
            .then(response=>{
                console.log(response.data)
                videos[0]={
                    path:req.files[0].path,
                    videoResult: response.data.video.prediction_by_video,
                    depressionLevel:response.data.video.depression_level,
                    audioResult:response.data.video.prediction_by_audio,
                }
                console.log("videos",videos)
                const newSessionAnswer = new SessionAnswer({
                    user:user,
                    session:session,
                    videos:videos
                });
                newSessionAnswer.save()
                    .then(result=>{
                        res.json({
                            Status: "Successful",
                            Message: 'Session answers has been recorded successfully.',
                            VideoResult: videos[0].videoResult,
                            DepressionLevel:videos[0].depressionLevel,
                            AudioResult:videos[0].audioResult
                        })
                    })
                    .catch(error=>{
                        console.log(error)
                        res.json({
                            Status: "Unsuccessful",
                            Message: "Happened saving the record in " +
                                "DB.",
                            error: error
                        })
                    })
            })
            .catch(error=>{
                console.log(error)
                res.json("error")
            })
        // for(var i=0;i<1;i++){
        //     var videoResult = "";
        //     var audioResult = "";
        //
        //     // Get the depression level for each video
        //
        //     videoResponse = await axios.post(
        //         'http://127.0.0.1:8000/predict_vido_path/',
        //         '',
        //         {
        //             headers: {
        //                 'accept': 'application/json',
        //                 'content-type': 'application/x-www-form-urlencoded'
        //             }
        //         }
        //     );
        //     console.log("Video",videoResponse)

        }


}

function getSessions(session,userId){
    return new Promise((resolve,reject)=>{
        let sessionId = session._id
        SessionAnswer.find({session:sessionId,user:userId})
            .then(answer=>{
                if(answer.length>0){
                    resolve({
                        Session:session,
                        Status:"Completed",
                        Answer:answer
                    })
                }else{
                    resolve({
                        Session:session,
                        Status:"Available"
                    })
                }
            })
            .catch(error=>{
                reject({
                    Status: "Unsuccessful",
                    Message: "Happened while getting sessions answers from the DB",
                    Error: error
                })
            })
    })
}
exports.getSessionsUser = (req,res) => {
    const {userId}   = req.body
    if(userId===null||userId===""){
        res.json({Status: "Unsuccessful", Message: "User Id must be entered."})
    }else{
        Sessions.find()
            .then(sessions=>{
                Promise.all(sessions.map(session=>getSessions(session,userId)))
                    .then(updatedSessions=>{
                        res.json({Status:"Successful",SessionsOfUser:updatedSessions})
                    })
                    .catch(error => {
                        res.json({
                            Status: "Unsuccessful",
                            Message: "Happened while getting sessions from the DB",
                            Error: error
                        })
                    })
            })
            .catch(error=>{
                res.json({
                    Status: "Unsuccessful",
                    Message: "Happened receiving the answers in " +
                        "DB.",
                    error: error
                })
            })
    }
}

exports.getSessionResults  = (req,res) => {
    const {userId} = req.body
    if(userId===""){
        res.json({Status: "Unsuccessful", Message: "User Id must be entered."})
    }else{
        SessionAnswer.find({user:userId})
            .then(results=>{
                res.json({
                    SessionsResults:results
                })
            })
    }
}