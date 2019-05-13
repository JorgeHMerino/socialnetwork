import React from "react";
import axios from "./axios";
import FriendButton from "./friendbutton";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    async componentDidMount() {
        console.log("props in match", this.props.match.params.id);
        const acInfo = await axios.get(
            "/api-user/" + this.props.match.params.id
        );
        console.log("acInfo in data: ", acInfo.data);
        if (acInfo.data.match) {
            this.props.history.push("/");
        } else {
            this.setState(acInfo.data);
        }
    }
    render() {
        return (
            <div>
                <div>
                    {!this.state.imageurl && <img src="/defaultpicture.jpg" />}
                    {this.state.imageurl && (
                        <img
                            id="otherprofilepic"
                            src={this.state.imageurl}
                            alt={`${this.state.firstname} ${
                                this.state.lastname
                            }`}
                        />
                    )}
                    <div>
                        <div>
                            <h1 id="firstnamey">{this.state.firstname}</h1>
                        </div>
                        <div>
                            <p id="bioy"> {this.state.bio}</p>
                        </div>
                    </div>
                </div>
                <FriendButton
                    myId={this.props.myId}
                    otherUserId={this.props.match.params.id}
                />
            </div>
        );
    }
}
