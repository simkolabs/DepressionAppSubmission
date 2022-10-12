import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login';
import "./socialMediaPage.css";
import {BiLogOutCircle} from "react-icons/bi";
import {Navigate} from "react-router-dom";
const axios = require('axios').default;

class SocialMediaPage extends Component {
    constructor(props) {
        const user = localStorage.getItem("user");
        const userParsed = JSON.parse(user);
        console.log(userParsed._id)
        super(props);
        this.state = {
            accessToken:"",
            id:"",
            userId:userParsed._id,
            posts:[],
            reDirectToHome:false
        }
    }
    componentClicked = (data )=> {

    }
    responseFacebook = (response) =>{
        this.setState({
            accessToken:response.accessToken,
            id:response.id
        },()=>{
            let posts = [];
            axios.get("https://graph.facebook.com/v15.0/"+this.state.id+"/posts?access_token="+this.state.accessToken)
                .then(async res => {
                    for (let i = 0; i < res.data.data.length; i++) {
                        let element = res.data.data[i]
                        if (element.message != null) {
                            console.log(element.message)
                            const response = await axios.post(
                                'http://127.0.0.1:8000/text/',
                                '',
                                {
                                    params: {
                                        'message': element.message
                                    },
                                    headers: {
                                        'accept': 'application/json',
                                        'content-type': 'application/x-www-form-urlencoded'
                                    }
                                }
                            );
                            posts.push({
                                "post":element.message,
                                "result":response.data
                            })
                            console.log("POSTS ",posts)
                            axios.post('http://localhost:3003/api/fbPosts/saveFacebookPost', {
                                "userId":this.state.userId,
                                "post":element.message,
                                "result":response.data
                            })
                                .then(response => {
                                    console.log(response)
                                    this.setState({reDirectToSessionsList:true})
                                })
                        }
                    }
                    this.setState({
                        posts:posts
                    },()=>{
                        console.log("Machine results  ",this.state.posts)
                    })
                })
                .catch(error=>{
                    console.log(error)
                })
        })

    }
    // 735493277533052

    render() {
        if(this.state.reDirectToHome){
            return <Navigate to="/home"/>
        }else{
            return (
                <div className="postsMainBody">
                    <div className="postsTitle">
                        <p className="postsTitleText">DEPRESSION ANALYSIS OF FACEBOOK POST</p>
                        <br/>
                        <FacebookLogin
                            appId="973684093550524"
                            autoLoad={true}
                            fields="name,email,picture"
                            onClick={this.componentClicked}
                            callback={this.responseFacebook}
                            className="facebookLoginButton"
                        />
                    </div>

                    <div className="postsDisplayContainer">'
                        <div className="singlePostElement">
                            <h5 className="postTitle">Post</h5>
                            <h5 className="postTitle">Result</h5>
                        </div>
                        {
                            this.state.posts.map(post=>{
                                return(
                                    <div className="singlePostElement">
                                        <h5 className="post">{post.post}</h5>
                                        <h5 className="result">{post.result}</h5>
                                    </div>
                                );
                            })
                        }

                    </div>
                    <div className="socialButtonContainer">
                        <div></div>
                        <div className="homeButton"  onClick={(e)=> {
                            e.preventDefault()
                            this.setState({reDirectToHome: true})
                        }}>
                            <p className="homeButtonText">Home</p>
                        </div>
                        <div></div>
                        {/*<div className="postsSaveButton"  onClick={(e)=> {*/}
                        {/*    e.preventDefault()*/}
                        {/*    this.setState({reDirectToHome: true})*/}
                        {/*}}>*/}
                        {/*    <p className="postsSaveButtonText">Save Results</p>*/}
                        {/*</div>*/}
                        <div></div>
                    </div>
                </div>

            );
        }
    }
}

export default SocialMediaPage;