import React from "react";
import ProfilePic from "./profilepic";
import BioEditor from "./bioeditor";

export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        console.log("props in profile: ", this.props);
        return (
            <div className="profileBox">
                <div className="profilepicFlex">
                    <ProfilePic
                        image={this.props.image}
                        first={this.props.first}
                        last={this.props.last}
                        showUploader={this.props.showUploader}
                    />
                </div>
                <div className="bioeditorFlex">
                    <BioEditor
                        bio={this.props.bio}
                        setBio={this.props.setBio}
                    />
                </div>
            </div>
        );
    }
}
