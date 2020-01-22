//frontend/src/app.js
import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import Login from './Login';
import Logout from './Logout';
import Registration from './Registration';
import NavigationBar from './app/Navigation';

import StudyInfo from './study/StudyInfo';
import EditStudy from './study/EditStudy';
import NewStudy from './study/NewStudy';
import Studies from './Study';

import EditQuestion from './question/EditQuestion';
import NewQuestion from './question/NewQuestion';
import Questions from './Question';

import ContactForm from './Contact'
import { Route, BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import Authenticated from './app/Authenticated';
import * as helpers from '../utils/jwt';
import internalServer from './error/InternalServer'
import notFound from './error/NotFound'



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
                // console.log("refresh success")
                this.handleTokenRefreshSuccess(result);
            }
        )
        .catch(err => {
                // console.log("token refresh failed", err);
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
                            <Route exact path="/study/edit/:id" render={props => (
                                <Authenticated {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    user={this.state.user}
                                    clearAuthInfo={this.clearAuthInfo}
                                >
                                    <EditStudy {...props} loggedInStatus={this.state.loggedInStatus} user={this.state.user} study={props.location.study} />
                                </Authenticated>
                            )}
                            />
                            <Route exact path="/study/list" render={props => (
                                <Studies {...props} loggedInStatus={this.state.loggedInStatus} user={this.state.user} page={1} studyListUrl="http://localhost:8000/study/" />
                            )}
                            />

                            <Route exact path="/question/new" render={props => (
                                <Authenticated {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    user={this.state.user}
                                    clearAuthInfo={this.clearAuthInfo}
                                >
                                    <NewQuestion {...props} loggedInStatus={this.state.loggedInStatus} user={this.state.user}/>
                                </Authenticated>
                            )}
                            />
                            <Route exact path="/question/edit/:id" render={props => (
                                <Authenticated {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    user={this.state.user}
                                    clearAuthInfo={this.clearAuthInfo}
                                >
                                    <EditQuestion {...props} loggedInStatus={this.state.loggedInStatus} user={this.state.user} question={props.location.question} />
                                </Authenticated>
                            )}
                            />
                            <Route exact path="/question/list" render={props => (
                                <Questions {...props} loggedInStatus={this.state.loggedInStatus} user={this.state.user} page={1} questionListUrl="http://localhost:8000/question/" />
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
                            <Route path="/500" component={internalServer} />
                            <Route component={notFound} />
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
