import React, {Component} from 'react';
import ReactPlayer from 'react-player';
import {ReactMediaRecorder} from "react-media-recorder";
import './sessionPage.css'
import { FaBeer , FaHome} from 'react-icons/fa';
import {Navigate} from "react-router-dom";
import { Oval } from  'react-loader-spinner'
import fixWebmDuration from 'webm-duration-fix';

const axios = require('axios').default;
class SessionPage extends Component {

    constructor(props) {
        super(props);
        const session = localStorage.getItem("SelectedSession");
        const sessionParsed = JSON.parse(session);
        const sessionDetails = sessionParsed.Session
        const user = localStorage.getItem("user");
        const userParsed = JSON.parse(user);
        console.log("SessionDetails ",sessionDetails)
        this.state = {
            message:"",
            questions:sessionDetails.questions,
            selectedRecordedVideo:"",
            videos:[],
            blobUrls:[],
            count:0,
            user:userParsed._id,
            session:"626f983b1e9a9f3964b46830",
            sessionName:"Session1",
            userName:"User1",
            recordingStatus:"Not yet answered for any question.",
            reDirectToHome:false,
            reDirectToSessionsList:false,
            generatingResults: false,
            reDirectToResults:false,
            videoResult:{}
        }
    }



    answerSubmit = async (e) => {
        e.preventDefault()
        if(this.state.videos.length===0){
            console.log("There are no recordings.")
        }else{
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            const formData = new FormData();
            formData.append("user", this.state.user);
            formData.append("session", this.state.session);
            formData.append("videos", this.state.videos[0]);
            for(let i=0;i<this.state.videos.length;i++){
                formData.append("videos", this.state.videos[i]);
            }
            this.setState({
                generatingResults: true
            },()=>{
                axios.post('http://localhost:3003/api/sessionAnswers/addSessionAnswer', formData)
                    .then(response => {
                        console.log(response.data)
                        this.setState({
                            videoResult:response.data
                        })
                        this.setState({
                            generatingResults: false,
                            reDirectToResults:true
                        })
                    })
            })

        }
    }

    render() {
        const mimeType = 'video/webm\;codecs=vp9';
        const blobSlice = [];

        console.log(this.state.questions)
        let count =0;
        if(this.state.reDirectToHome){
            return <Navigate to="/home"/>
        }else if(this.state.reDirectToSessionsList){
            return <Navigate to="/sessionSelection"/>
        } else if(this.state.generatingResults){
            return (
                <div className="loader">
                    <h1 className="loaderTitle">Analysing the video</h1>
                    <Oval
                        height={"20%"}
                        width={"20%"}
                        color="#EA2027"
                        wrapperStyle={{
                            marginLeft:"45%",
                        }}
                        wrapperClass=""
                        visible={true}
                        ariaLabel='oval-loading'
                        secondaryColor="#636e72"
                        strokeWidth={1}
                        strokeWidthSecondary={2}

                    />
                </div>
            )
        } else if(this.state.reDirectToResults){
            return(
                <div className="resultsContainer">
                    <div className="resultsHeaderContainer">
                        <p className="resultsHeader">The results of the Video Analysis</p>
                    </div>
                    <div className="detailsContainer">
                        <div className="detailsSubContainer1">
                            <h5 className="detailsHeader">Video Result</h5>
                            <h6 className="details">{this.state.videoResult.VideoResult}</h6>
                        </div>
                        <div className="detailsSubContainer2">
                            <h5 className="detailsHeader">Audio Result </h5>
                            <h6 className="details">{this.state.videoResult.AudioResult}</h6>
                        </div>
                        <div className="detailsSubContainer3">
                            <h5 className="detailsHeader">Depression Level </h5>
                            <h6 className="details">{this.state.videoResult.DepressionLevel} %</h6>
                        </div>
                    </div>
                    <div className="session_results_go_home" onClick={(e)=>{
                        e.preventDefault()
                        this.setState({reDirectToHome:true})
                    }}
                    >
                        <FaHome className="session_results_home_icon"/>
                        <h7>Home</h7>
                    </div>
                </div>
            )
        }else{
            return (
                <div className="sessionPageMainBody">
                    <ReactMediaRecorder
                        video
                        render={({status, startRecording, stopRecording, mediaBlobUrl}) => (
                            <div className="session_page_main_body">
                                {this.state.props}
                                <div className="player_container">
                                    <div className="session_answers_go_home" onClick={(e)=>{
                                        e.preventDefault()
                                        this.setState({reDirectToHome:true})
                                    }}
                                    >
                                        <FaHome className="session_page_home_icon"/>
                                        <h7>Home</h7>
                                    </div>

                                    <div className="questionsContainer">
                                        <h1>Questions</h1>
                                        {
                                            this.state.questions.map((question,index)=>{
                                                return  (<h5>{index+1}) {question}</h5>);
                                            })
                                        }
                                    </div>
                                </div>

                                <div className="session_page_answers">
                                    <div className="session_page_answer_video">
                                        <div className="videoRecordPlayerContainer">
                                            <video width="100%" className="recordPayer"
                                                   height="100%" src={this.state.selectedRecordedVideo} controls autoPlay/>
                                        </div>

                                        <div className="session_page_record_button_container">
                                            <div className='session_page_recording_status'>
                                                <h7>{this.state.recordingStatus}</h7>
                                            </div>
                                            <div
                                                className="session_page_answer_button"
                                                onClick ={
                                                    () => {
                                                        startRecording();
                                                    }
                                                }
                                            >
                                                <h7>Start</h7>
                                            </div>
                                            <div
                                                className="session_page_stop_answer_button"
                                                onClick={async ()=>{
                                                    stopRecording()
                                                }}
                                            >
                                                <h7>Stop</h7>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="session_page_answers_list">
                                        <p className="session_page_answers_list_title">Answers</p>
                                        {
                                            this.state.blobUrls.map((element,idx) => {
                                                return(
                                                    <div className="answer_container" onClick={()=>{
                                                        this.setState({
                                                            selectedRecordedVideo:element
                                                        })
                                                    }}>
                                                        <h7 className="answer">Answer {idx+1}</h7>
                                                    </div>
                                                );
                                            })
                                        }
                                    </div>
                                </div>
                            </div>
                        )}
                        ondataavailable ={(event) => {
                            blobSlice.push(event.data);
                        }}
                        onStart={
                            ()=>{
                                this.setState({
                                    recordingStatus:"Started answering for question "+(this.state.videos.length+1)
                                })
                            }
                        }
                        onStop={
                            async (blobUrl, blob) => {


                                console.log("Blob URL",blobUrl);
                                const videoBlob =  await fetch(blobUrl).then(r => r.blob());
                                const fixBlob = await fixWebmDuration(blob);
                                const videoFile = new File([fixBlob],
                                    "data", { type: "video/webm" })
                                let videosCopy = []
                                let blobUrlsCopy = []
                                let i =0;
                                for(;i<this.state.videos.length;i++){
                                    videosCopy[i]=this.state.videos[i]
                                    blobUrlsCopy[i] =  this.state.blobUrls[i]
                                }
                                videosCopy[i] = videoFile
                                blobUrlsCopy[i] = blobUrl
                                this.setState({
                                    count : this.state.count++,
                                    videos : videosCopy,
                                    blobUrls : blobUrlsCopy,
                                    selectedRecordedVideo:blobUrl,
                                    recordingStatus:"Stopped answering for question "+(i+1)
                                })
                            }
                        }
                    />
                    <div className="session_page_submit_button_container">
                        <div
                            className="session_answers_submit_button"
                            onClick={
                                (e)=>this.answerSubmit(e)}
                        >
                            <p>Submit Answers</p>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default SessionPage;

