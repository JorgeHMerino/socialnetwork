import React from "react";
import axios from "./axios";

// Export in Log In
export default class Login extends React.Component {
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
        axios
            .post("/login", {
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
                <h3 id="punto"> • • • </h3>
                <h3 id="logino"> log in </h3>
                {this.state.error && (
                    <div className="error" id="erroryTwo">
                        something is missing, please try again
                    </div>
                )}
                <input
                    id="emailyTwo"
                    name="email"
                    placeholder="email"
                    type="text"
                    autoComplete="off"
                    onChange={e => this.handleChange(e)}
                />
                <input
                    id="passwordyTwo"
                    name="password"
                    placeholder="password"
                    type="password"
                    autoComplete="off"
                    onChange={e => this.handleChange(e)}
                />
                <button id="loginbutt" onClick={this.submit}>
                    {" "}
                    log in{" "}
                </button>
            </div>
        );
    }
}
