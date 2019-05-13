import React from "react";
import { HashRouter, Route } from "react-router-dom";
// Registration
import Registration from "./registration";
// Log In
import Login from "./login";

// Export in Welcome
export default class Welcome extends React.Component {
    render() {
        return (
            <div>
                <h2 id="welcomeTo"> Welcome to </h2>
                <img id="logo" src="mobiliteca.jpg" />
                <HashRouter>
                    <div>
                        <Route component={Registration} exact path="/" />
                        <Route component={Login} path="/login" />
                    </div>
                </HashRouter>
            </div>
        );
    }
}
