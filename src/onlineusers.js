import React from "react";
import { connect } from "react-redux";

export class OnlineUsers extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { onlineUsers } = this.props;
        console.log("show this.props here: ", this.props);
        if (!onlineUsers) {
            return null;
        }
        const list = (
            <div>
                {onlineUsers.map(onlineUsers => {
                    return (
                        <div className="paddingfriends" key={onlineUsers.id}>
                            <img
                                className="picinfriends"
                                src={onlineUsers.imageurl}
                            />
                            <p className="textinfriends">
                                {onlineUsers.firstname} {onlineUsers.lastname}
                            </p>
                        </div>
                    );
                })}
            </div>
        );
        return (
            <div>
                <h2 className="friendy"> online users </h2>
                {list}
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log("show state in mapStateToProps: ", state);
    return {
        onlineUsers: state.onlineUsers
    };
};
export default connect(mapStateToProps)(OnlineUsers);
