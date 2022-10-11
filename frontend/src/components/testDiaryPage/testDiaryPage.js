import React, {Component} from 'react';
import {default as axios} from "axios";
import "./testDiaryPage.css";
import {FaHome} from "react-icons/fa";
import {Navigate} from "react-router-dom";

class TestDiaryPage extends Component {
    constructor(props) {
        super(props);
        const user = localStorage.getItem("user");
        const userParsed = JSON.parse(user);
        this.state = {
            reDirectToHome: false,
            fbPosts: [],
            sessionResults:[],
            user:userParsed._id,
        }
    }
    async componentDidMount() {
        axios.post("http://localhost:3003/api/fbPosts/getFacebookResults",{userId:this.state.user})
            .then(response => {
                const res = response.data.Posts

                let fbPosts = []
                for (let i = 0; i < res.length; i++) {
                    fbPosts.push(res[i])

                }
                this.setState({
                    fbPosts:fbPosts
                }, () => {
                    console.log("Posts", this.state.fbPosts)
                })

                axios.post("http://localhost:3003/api/sessionAnswers/getSessionResultsOfUser",{userId:this.state.user})
                    .then(response2 => {
                        const res2 = response2.data.SessionsResults

                        let sessionResults = []
                        for (let i = 0; i < res2.length; i++) {
                            sessionResults.push(res2[i])

                        }
                        this.setState({
                            sessionResults:sessionResults
                        }, () => {
                            console.log("Sessions ", this.state.sessionResults)
                        })
                    })
            })
    }


    render() {
        if(this.state.reDirectToHome){
            return <Navigate to="/home"/>
        }else{
            return (
                <div className="testDiaryMainContainer">
                    <div className="sessionAnswersHistoryContainer">
                        <h4 className="historyTitle">History of Session Analysis</h4>
                        <table className="historyTable">
                            <tr className="headerRow">
                                <th className="headerElement">Audio Analysis Result</th>
                                <th className="headerElement">Video Analysis Result</th>
                                <th className="headerElement">Depression Level</th>

                            </tr>

                            {this.state.sessionResults.map((element,index)=>{
                                return(
                                    <tr className="dataRow">
                                        <td className="dataElement">{element.videos[0]?.audioResult}</td>
                                        <td className="dataElement">{element.videos[0]?.videoResult}</td>
                                        <td className="dataElement">{element.videos[0]?.depressionLevel}</td>
                                    </tr>
                                )
                            })}
                        </table>
                    </div>
                    <div className="facebookHistoryContainer">
                        <h4 className="historyTitle">History of Facebook Posts Analysis</h4>
                        <table className="historyTable2">
                            <tr className="headerRow2">
                                <th className="headerElement2">Post</th>
                                <th className="headerElement3">Result</th>
                            </tr>

                            {this.state.fbPosts.map((element,index)=>{
                                return(
                                    <tr className="dataRow2">
                                        <td className="dataElement2">{element.post}</td>
                                        <td className="dataElement3">{element.result}</td>
                                    </tr>
                                )
                            })}
                        </table>
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
            );
        }
    }
}

export default TestDiaryPage;