import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bioEditorIsVisible: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.update = this.update.bind(this);
        this.showBioEditor = this.showBioEditor.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    update(bioSentence) {
        console.log("update function: ", this.bio);
        axios.post("/setbio", { bioSentence }).then(({ data }) => {
            console.log("data aftet setbio post: ", data);
            this.props.setBio(data);
            this.setState({ bioEditorIsVisible: false });
        });
    }
    showBioEditor() {
        const { bioEditorIsVisible } = this.state;
        this.setState({
            bioEditorIsVisible: !bioEditorIsVisible
        });
    }
    render() {
        return (
            <div>
                <h1 id="yourbio"> My Bio </h1>
                <h2 id="pleasy"> a few lines about me: </h2>
                {!this.props.bio && (
                    <button onClick={this.showBioEditor} id="addbio">
                        {" "}
                        add bio here{" "}
                    </button>
                )}
                <h3 id="myBio"> {this.props.bio} </h3>
                {this.props.bio && (
                    <div>
                        {" "}
                        <button id="edit" onClick={this.showBioEditor}>
                            {" "}
                            edit{" "}
                        </button>{" "}
                    </div>
                )}
                {this.state.bioEditorIsVisible && (
                    <div>
                        <textarea
                            id="textareabio"
                            name="bioSentence"
                            rows="6"
                            columns="20"
                            onChange={this.handleChange}
                        />
                        <button
                            onClick={() => {
                                this.update(this.bioSentence);
                            }}
                            id="savebutton"
                        >
                            {" "}
                            save{" "}
                        </button>
                    </div>
                )}
                {!this.state.bioEditorIsVisible && null}
            </div>
        );
    }
}
