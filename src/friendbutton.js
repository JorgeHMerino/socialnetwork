import React from "react";
import axios from "./axios";

export default class FriendButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleClick = this.handleClick.bind(this);
    }
    async componentDidMount() {
        const myId = this.props.myId;
        const otherUserId = this.props.otherUserId;
        console.log("props on otherUserId: ", this.props.otherUserId);
        const initialStatus = await axios.get(
            "/get-initial-status/" + this.props.otherUserId
        );
        console.log("/get-initial-status/: ", initialStatus);
        if (!initialStatus.data) {
            this.setState({ buttonText: "send friend request" });
        } else if (initialStatus.data.accepted) {
            this.setState({ buttonText: "unfriend" });
        } else if (
            !initialStatus.data.accepted &&
            initialStatus.data.receiver == otherUserId
        ) {
            this.setState({ buttonText: "cancel request" });
        }
        // if (
        //     !initialStatus.data.accepted &&
        //     initialStatus.data.receiver == myId
        // )
        else {
            this.setState({ buttonText: "accept request" });
        }
    }
    async handleClick() {
        const buttonText = this.state.buttonText;
        const otherUserId = this.props.otherUserId;
        if (buttonText == "send friend request") {
            console.log("handleClick working");
            const currentStatus = await axios.post("/friendship-status", {
                action: "add",
                otherId: otherUserId
            });
            this.setState({ buttonText: "cancel request" });
            console.log("currentStatus: ", currentStatus);
        } else if (buttonText == "cancel request" || buttonText == "unfriend") {
            const cancelRequest = await axios.post("/friendship-status", {
                action: "cancel",
                otherId: otherUserId
            });
            this.setState({ buttonText: "send friend request" });
            console.log("cancelRequest: ", cancelRequest);
        } else if (buttonText == "accept request") {
            const acceptRequest = await axios.post("/friendship-status", {
                action: "accept",
                otherId: otherUserId
            });
            this.setState({ buttonText: "unfriend" });
            console.log("acceptRequest: ", acceptRequest);
        }
    }
    render() {
        return (
            <div>
                <button
                    name="requestButton"
                    id="requestButton"
                    onClick={this.handleClick}
                >
                    {this.state.buttonText}
                </button>
            </div>
        );
    }
}
