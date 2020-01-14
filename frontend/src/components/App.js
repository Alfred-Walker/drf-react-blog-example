//frontend/src/app.js
import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import Login from './auth/login';
import Logout from './auth/logout';
import Registration from './auth/registration';
import NavigationBar from './navigation';
import StudyInfo from './study/studyInfo';
import NewStudy from './study/newStudy';
import Studies from './study/studies';
import ContactForm from './contact'
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Authenticated from './auth/authenticated';
import * as helpers from './helpers/jwt';


class App extends Component {
    constructor() {
        super();

        this.state = {
            loggedInStatus: "NOT_LOGGED_IN",
            user: undefined
        }

        this.clearAuthInfo = this.clearAuthInfo.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleTokenRefreshSuccess = this.handleTokenRefreshSuccess.bind(this);
    }

    clearAuthInfo() {
        localStorage.clear();
        this.setState({
            loggedInStatus: "NOT_LOGGED_IN",
            user: undefined
        });
    }

    initializeAuthInfo() {
        const token = helpers.getJwt();

        // clear localStorage if there is no access token
        if (!token || token === 'undefined') {
            localStorage.clear();
            return;
        }

        // verify existing token's life before POST
        const isExpired = helpers.isJwtExpired(token);
        
        if (isExpired) {
            localStorage.clear();
            return;
        }
            
        // refresh token
        fetch(
            'http://localhost:8000/jwt-auth/refresh/', {
                method: 'POST',
                headers: {'Content-Type': 'application/json; charset="utf-8"'},
                body: JSON.stringify({token: token}),
                credentials: 'include'
            }
        )
        .then(
            response => response.json()
        )
        .then(
            result => {
                console.log("refresh success")
                this.handleTokenRefreshSuccess(result);
            }
        )
        .catch(err => {
                console.log("token refresh failed", err);
                this.handleTokenRefreshFailure();
            }
        );
    }

    componentDidMount() {
        this.initializeAuthInfo();
    }

    handleLogin(data) {
        localStorage.setItem("jwt-token", data.token);
        this.setState({
            loggedInStatus: "LOGGED_IN",
            user: data.user
        });
    }

    handleLogout(data) {
        this.clearAuthInfo();
    }

    handleTokenRefreshSuccess(data) {
        localStorage.setItem("jwt-token", data.token);
        this.setState({
            loggedInStatus: "LOGGED_IN",
            user: data.user
        });
    }

    handleTokenRefreshFailure(data) {
        this.clearAuthInfo();
    }

    render() {
        return (
            <div className="App">
                <div className="container">
                    <Router>
                        <NavigationBar loggedInStatus={this.state.loggedInStatus} />
                        <Switch>
                            <Route exact path="/" render={props => (
                                <StudyInfo {...props} loggedInStatus={this.state.loggedInStatus} user={this.state.user} />
                            )}
                            />
                            <Route exact path="/study/new" render={props => (
                                <Authenticated {...props} 
                                    loggedInStatus={this.state.loggedInStatus} 
                                    user={this.state.user} 
                                    clearAuthInfo={this.clearAuthInfo}
                                >
                                    <NewStudy {...props} loggedInStatus={this.state.loggedInStatus} user={this.state.user}/>
                                </Authenticated>
                            )}
                            />
                            <Route exact path="/study/list" render={props => (
                                <Studies {...props} loggedInStatus={this.state.loggedInStatus} user={this.state.user} studyListUrl="http://localhost:8000/study/" />
                            )}
                            />
                            <Route exact path="/contact" render={props => (
                                <ContactForm {...props} loggedInStatus={this.state.loggedInStatus} user={this.state.user} />
                            )}
                            />
                            <Route exact path="/login" render={props => (
                                <Login {...props} loggedInStatus={this.state.loggedInStatus} handleLogin={this.handleLogin} />
                            )}
                            />
                            <Route exact path="/logout" render={props => (
                                <Logout {...props} loggedInStatus={this.state.loggedInStatus} user={this.state.user} handleLogout={this.handleLogout} />
                            )}
                            />
                            <Route exact path="/registration" render={props => (
                                <Registration {...props} loggedInStatus={this.state.loggedInStatus} />
                            )}
                            />
                        </Switch>
                    </Router>
                </div>
            </div >
            /*
            <div>
            {
            Object.keys(this.state.response).map((key) => {
               const ret = <div>Key: {key}, Value: {key === "results" && this.state.response[key] ? this.state.response[key].map((result) => {
               const ret = <div>{ result ? Object.keys(result).map((study) => {
                   return result[study];
               }) : "None" }</div>;
               return ret;
            })
            : this.state.response[key]}</div>;
            return ret;
            })
            }

            </div>
            */
        );
    }
}

export default App;
