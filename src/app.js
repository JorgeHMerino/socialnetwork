import React from "react";
import axios from "./axios";
import Uploader from "./uploader";
import Profile from "./profile";
import ProfilePic from "./profilepic";
import { BrowserRouter, Route } from "react-router-dom";
import OtherProfile from "./otherprofile";
import Friends from "./friends";
import OnlineUsers from "./onlineusers";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            uploaderIsVisible: false,
            bio: ""
        };
        this.showUploader = this.showUploader.bind(this);
        this.setImage = this.setImage.bind(this);
        this.setBio = this.setBio.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
    }
    showUploader() {
        const { uploaderIsVisible } = this.state;
        this.setState({
            uploaderIsVisible: !uploaderIsVisible
        });
    }
    hideUploader() {
        this.setState({
            uploaderIsVisible: false
        });
    }
    setImage(image) {
        console.log("image in image: ", image);
        this.setState({ imageurl: image, uploaderIsVisible: false });
    }
    setBio(bioSentence) {
        this.setState({ bio: bioSentence.bio });
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            console.log("data in user: ", data);

            this.setState(data);
        });
        axios.get("/getbio").then(({ data }) => {
            this.setState({ bio: data.bio });
        });
    }
    render() {
        if (!this.state.id) {
            return null;
        }
        console.log("this.state: ", this.state);
        return (
            <div>
                <BrowserRouter>
                    <div>
                        <div>
                            <img id="logoo" src="/mobiliteca.jpg" />
                            <div id="profilepicTwo">
                                <ProfilePic
                                    image={this.state.imageurl}
                                    first={this.state.firstname}
                                    last={this.state.lastname}
                                    showUploader={this.showUploader}
                                />
                            </div>
                        </div>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <div>
                                    <Profile
                                        image={this.state.imageurl}
                                        first={this.state.firstname}
                                        last={this.state.lastname}
                                        showUploader={this.showUploader}
                                        bio={this.state.bio}
                                        setBio={this.setBio}
                                    />
                                    {this.state.uploaderIsVisible && (
                                        <Uploader
                                            setImage={this.setImage}
                                            hideUploader={this.hideUploader}
                                        />
                                    )}
                                </div>
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render={props => (
                                <OtherProfile
                                    // myId={this.state.myId}
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/friends" component={Friends} />
                        <Route path="/online" component={OnlineUsers} />
                    </div>
                </BrowserRouter>
            </div>
        );
    }
}
