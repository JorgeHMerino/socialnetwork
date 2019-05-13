import React from "react";
import { connect } from "react-redux";
import { receiveFriendsWannabes, deleteFriend, acceptFriend } from "./actions";

class Friends extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        this.props.dispatch(receiveFriendsWannabes());
    }
    render() {
        console.log("show friends and wannabes: ", this.props);
        const { friends, wannabes } = this.props;
        console.log("show friends :", friends);
        if (!friends || !wannabes) {
            return null;
        }
        const acceptedFriends = (
            <div className="flexfriends">
                {friends.map(friend => (
                    <div key={friend.id}>
                        <div>
                            <div className="paddingfriends">
                                <p className="textinfriends">
                                    {friend.firstname}
                                    {friend.lastname}
                                </p>
                                <div className="">
                                    <div className="">
                                        <img
                                            className="picinfriends"
                                            src={friend.imageurl}
                                        />
                                    </div>
                                    <div className="">
                                        <button
                                            className="buttoninfriends"
                                            onClick={() =>
                                                this.props.dispatch(
                                                    deleteFriend(friend.id)
                                                )
                                            }
                                        >
                                            {" "}
                                            delete friend
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
        const currentWannabes = (
            <div className="flexfriends">
                {wannabes.map(wannabe => (
                    <div key={wannabe.id}>
                        <div>
                            <div className="paddingfriends">
                                <p className="textinfriends">
                                    {wannabe.firstname}
                                    {wannabe.lastname}
                                </p>
                                <div className="">
                                    <div id="">
                                        <img
                                            className="picinfriends"
                                            src={wannabe.imageurl}
                                        />
                                    </div>
                                    <div id="">
                                        <button
                                            className="buttoninfriends"
                                            onClick={() =>
                                                this.props.dispatch(
                                                    acceptFriend(wannabe.id)
                                                )
                                            }
                                        >
                                            {" "}
                                            accept friend
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
        return (
            <div>
                <h4 className="friendy"> your friends </h4>
                {!friends.length && (
                    <div className="noty"> not friends yet </div>
                )}
                {!!friends.length && acceptedFriends}
                <h4 className="friendy"> friends to be </h4>
                {!friends.length && (
                    <div className="noty"> not friend requests yet </div>
                )}
                {!!friends.length && currentWannabes}
            </div>
        );
    }
}
// mapStateToProps
const mapStateToProps = state => {
    return {
        wannabes:
            state.allFriends &&
            state.allFriends.filter(friend => friend.accepted === false),
        friends:
            state.allFriends &&
            state.allFriends.filter(friend => friend.accepted === true)
    };
};
export default connect(mapStateToProps)(Friends);
//
