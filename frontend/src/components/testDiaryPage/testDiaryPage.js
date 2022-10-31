import React, {Component} from 'react';
import {default as axios} from "axios";
import "./testDiaryPage.css";
import {FaHome} from "react-icons/fa";
import {Navigate} from "react-router-dom";
import {format} from 'date-fns';

class TestDiaryPage extends Component {
    constructor(props) {
        super(props);
        const user = localStorage.getItem("user");
        const userParsed = JSON.parse(user);
        this.state = {
            reDirectToHome: false,
            fbPosts: [],
            sessionResults: [],
            user: userParsed._id,
            btn1: "btn1NotSelected",
            btn2: "btn2NotSelected",
            displayFacebook: false,
            displaySessions: true,
            finalSessionsResult: "Calculating....",
            finalFBResult: "Calculating...."
        }
    }

    async componentDidMount() {
        axios.post("http://localhost:3003/api/fbPosts/getFacebookResults", {userId: this.state.user})
            .then(response => {
                const res = response.data.Posts
                let depressiveFB = 0;
                let fbPosts = []
                for (let i = 0; i < res.length; i++) {
                    fbPosts.push(res[i])
                    if (res[i].result == "Depressive") {
                        depressiveFB++;
                    }
                }
                let fbPercentage = depressiveFB / res.length * 100;
                let fbResult = ""
                if (fbPercentage > 75) {
                    fbResult = "High"
                } else if (fbPercentage > 50) {
                    fbResult = "Medium"
                } else {
                    fbResult = "Low"
                }
                this.setState({
                    fbPosts: fbPosts,
                    finalFBResult: fbResult
                })

                axios.post("http://localhost:3003/api/sessionAnswers/getSessionResultsOfUser", {userId: this.state.user})
                    .then(response2 => {
                        const res2 = response2.data.SessionsResults

                        let sessionResults = []
                        let finalResultSessions = ""
                        let totalSessionsCount = 0
                        let depressiveSessionCount = 0
                        for (let i = 0; i < res2.length; i++) {
                            for (let j = 0; j < res2[i].videos.length; j++) {
                                let video = res2[i].videos[j]
                                let sumResult = ""
                                if (video.audioResult === "Depressive" && video.videoResult === "Depressed") {
                                    sumResult = "High"
                                } else if (video.audioResult === "Positive" && video.videoResult === "Positive") {
                                    sumResult = "Low"
                                } else {
                                    sumResult = "Medium"
                                }
                                if (sumResult === "High") {
                                    depressiveSessionCount++;
                                }
                                totalSessionsCount++
                            }
                            sessionResults.push(res2[i])
                        }
                        if (depressiveSessionCount / totalSessionsCount * 100 > 75) {
                            finalResultSessions = "High"
                        } else if (depressiveSessionCount / totalSessionsCount * 100 > 50) {
                            finalResultSessions = "Medium"
                        } else {
                            finalResultSessions = "Low"
                        }
                        this.setState({
                            sessionResults: sessionResults,
                            finalSessionsResult: finalResultSessions
                        })
                    })
            })
    }


    render() {
        if (this.state.reDirectToHome) {
            return <Navigate to="/home"/>
        } else {
            return (
                <div className="testDiaryMainContainer">
                    <div className="sessionAnswersHistoryContainer">
                        <div className="recordsSelection">
                            <div className="sessionsRecordsSelectionElement" id={this.state.btn1} onClick={() => {
                                this.setState({
                                    displayFacebook: true,
                                    displaySessions: false,
                                    btn1: "btn1Selected",
                                    btn2: "btn2NotSelected",
                                })
                            }}>
                                <h5 className="recordsSelectionText">Social Analysis Records</h5>
                            </div>
                            <div className="sessionsRecordsSelectionElement" id={this.state.btn2} onClick={() => {
                                this.setState({
                                    displayFacebook: false,
                                    displaySessions: true,
                                    btn1: "btn1NotSelected",
                                    btn2: "btn2Selected",
                                })
                            }}>
                                <h5 className="recordsSelectionText">Video Analysis Records</h5>
                            </div>
                            <div className="test_page_go_home" onClick={(e) => {
                                e.preventDefault()
                                this.setState({reDirectToHome: true})
                            }}
                            >
                                <FaHome className="test_page_home_icon"/>
                                <h7>Home</h7>
                            </div>
                        </div>
                        {
                            this.state.displaySessions ?
                                <div>
                                    <h4 className="historyTitle">History of Session Analysis</h4>
                                    <div className="depressionLevel">
                                        <h7>Your Depression Level is {this.state.finalSessionsResult}</h7>
                                    </div>
                                    <table className="historyTable">
                                        <tr className="headerRow">
                                            <th className="headerElement">Recorded Date</th>
                                            <th className="headerElement">Depression Level</th>

                                        </tr>

                                        {this.state.sessionResults.map((element, index) => {
                                            let dataRow = "dataRow" +(index % 5)
                                            let result = "High"
                                            let data = element.date
                                            if (element.videos[0]?.videoResult === "Depressed" &&
                                                element.videos[0]?.audioResult === "Depressive") {
                                                result = "High"
                                            } else if ((element.videos[0]?.videoResult === "Positive" &&
                                                    element.videos[0]?.audioResult === "Depressive") ||
                                                (element.videos[0]?.videoResult === "Depressed" &&
                                                    element.videos[0]?.audioResult === "Positive")
                                            ) {
                                                result = "Medium"
                                            } else if (element.videos[0]?.videoResult === "Positive" &&
                                                element.videos[0]?.audioResult === "Positive") {
                                                result = "Low"
                                            }
                                            return (
                                                <tr className="dataRow" id={dataRow}>
                                                    <td className="dataElement">{data}</td>
                                                    <td className="dataElement">{result}</td>
                                                </tr>
                                            )
                                        })}
                                    </table>
                                </div>
                                :
                                <div>
                                    <h4 className="historyTitle">History of Facebook Posts Analysis</h4>
                                    <div className={"depressionLevel"}>
                                        <h7>Your Depression Level is {this.state.finalFBResult}</h7>
                                    </div>
                                    <table className="historyTable2">
                                        <tr className="headerRow2">
                                            <th className="headerElement2">Post</th>
                                            <th className="headerElement3">Depression Level</th>
                                        </tr>

                                        {this.state.fbPosts.map((element, index) => {
                                            let dataRow = "dataRow"+(index % 5)
                                            let result = ""
                                            if(element.result==="depressive"){
                                                result = "Depressive"
                                            }else{
                                                result = "Not Depressive"
                                            }
                                            return (
                                                <tr className="dataRow2" id={dataRow}>
                                                    <td className="dataElement">{element.post}</td>
                                                    <td className="dataElement">{result}</td>
                                                </tr>
                                            )
                                        })}
                                    </table>
                                </div>
                        }

                    </div>


                </div>
            );
        }
    }
}

export default TestDiaryPage;