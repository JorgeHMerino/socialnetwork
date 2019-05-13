import React from "react";
import axios from "./axios";
// LINK
import { Link } from "react-router-dom";

// Export in Registration
export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.handleChange = this.handleChange.bind(this);
        this.submit = this.submit.bind(this);
    }
    handleChange(e) {
        this[e.target.name] = e.target.value;
    }
    submit() {
        console.log("password", this.password);
        axios
            .post("/registration", {
                firstname: this.firstname,
                lastname: this.lastname,
                email: this.email,
                password: this.password
            })
            .then(({ data }) => {
                console.log("mydata", data);
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true
                    });
                }
            });
    }
    render() {
        return (
            <div>
                <h2 id="smart"> social network </h2>
                <h3 id="join"> join us! </h3>
                {this.state.error && (
                    <div className="error" id="erroryOne">
                        something is missing, please try again
                    </div>
                )}
                <input
                    id="firsty"
                    name="firstname"
                    placeholder="first name"
                    type="text"
                    autoComplete="off"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    id="lasty"
                    name="lastname"
                    placeholder="last name"
                    type="text"
                    autoComplete="off"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    id="emaily"
                    name="email"
                    placeholder="email"
                    type="text"
                    autoComplete="off"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    id="passwordy"
                    name="password"
                    placeholder="password"
                    type="password"
                    autoComplete="off"
                    onChange={e => this.handleChange(e)}
                />
                <button id="submit" onClick={this.submit}>
                    {" "}
                    submit{" "}
                </button>
                <p id="ifyou">
                    {" "}
                    if you are already a member, please{" "}
                    <Link to="/login" id="loginclick">
                        {" "}
                        log in{" "}
                    </Link>
                </p>
            </div>
        );
    }
}
