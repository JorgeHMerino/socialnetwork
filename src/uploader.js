import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.upload = this.upload.bind(this);
    }
    upload(a) {
        console.log("this.props in uploader: ", this.props);
        axios.post("/upload-profilepic", a).then(({ data }) => {
            console.log("data while uploading", data.imageurl);
            this.props.setImage(data.imageurl);
        });
    }
    render() {
        return (
            <div id="uploadform">
                <p className="close" onClick={this.props.hideUploader}>
                    {" "}
                    x{" "}
                </p>
                <h3 id="would">
                    {" "}
                    would you like to change your profile picture?{" "}
                </h3>
                <div className="wrapper">
                    <button className="buttony">
                        {" "}
                        upload
                        <label>
                            <input
                                id="uploadinput"
                                name="file"
                                type="file"
                                value={this.formData}
                                onChange={e => {
                                    const formData = new FormData();
                                    formData.append("file", e.target.files[0]);
                                    console.log("file", e.target.files[0]);
                                    console.log("formData", formData);
                                    this.upload(formData);
                                }}
                            />
                        </label>
                    </button>
                </div>
                <button className="hide" onClick={this.upload}>
                    {" "}
                    upload{" "}
                </button>
            </div>
        );
    }
}
