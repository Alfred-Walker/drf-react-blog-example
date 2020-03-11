//frontend/src/app.js
import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import Login from './Login';
import Logout from './Logout';
import Registration from './Registration';
import NavigationBar from './app/Navigation';

import Home from './Home';

import StudyDetail from './study/StudyDetail';
import EditStudy from './study/EditStudy';
import NewStudy from './study/NewStudy';
import Studies from './Study';

import QuestionDetail from './question/QuestionDetail';
import EditQuestion from './question/EditQuestion';
import NewQuestion from './question/NewQuestion';
import Questions from './Question';

import Tags from './Tag';

import Contact from './Contact'
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Authenticated from './app/Authenticated';
import * as Utils from '../utils/jwt';
import Error from './Error'




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
        this.handleRegistration = this.handleRegistration.bind(this);
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
        const token = Utils.getJwt();

        // clear localStorage if there is no access token
        if (!token || token === 'undefined') {
            localStorage.clear();
            return;
        }

        // verify existing token's life before POST
        const isExpired = Utils.isJwtExpired(token);

        if (isExpired) {
            localStorage.clear();
            return;
        }

        // refresh token
        fetch(
            'http://localhost:8000/jwt-auth/refresh/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset="utf-8"' },
            body: JSON.stringify({ token: token }),
            credentials: 'include'
        }
        )
            .then(
                response => response.json()
            )
            .then(
                result => {
                    this.handleTokenRefreshSuccess(result);
                }
            )
            .catch(err => {
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

    handleRegistration(data) {
        localStorage.setItem("jwt-token", data.token);
        this.setState({
            loggedInStatus: "LOGGED_IN",
            user: data.user
        });
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
                                <Home
                                    {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    user={this.state.user}
                                />
                            )}
                            />
                            <Route exact path="/study/new" render={props => (
                                <Authenticated
                                    {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    user={this.state.user}
                                    clearAuthInfo={this.clearAuthInfo}
                                >
                                    <NewStudy
                                        {...props}
                                        loggedInStatus={this.state.loggedInStatus}
                                        user={this.state.user}
                                    />
                                </Authenticated>
                            )}
                            />
                            <Route exact path="/study/edit/:id" render={props => (
                                <Authenticated
                                    {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    user={this.state.user}
                                    clearAuthInfo={this.clearAuthInfo}
                                >
                                    <EditStudy
                                        {...props}
                                        loggedInStatus={this.state.loggedInStatus}
                                        user={this.state.user}
                                        study={props.location.study}
                                    />
                                </Authenticated>
                            )}
                            />
                            <Route exact path="/study" render={props => (
                                <Studies
                                    {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    user={this.state.user}
                                    page={1}
                                    studyListUrl="http://localhost:8000/study/"
                                    tagListUrl="http://localhost:8000/tag/"
                                />
                            )}
                            />
                            <Route exact path="/study/:id" render={props => (
                                <StudyDetail
                                    {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    user={this.state.user}
                                    study={props.location.study}
                                />
                            )}
                            />
                            <Route exact path="/tag/:tag" render={props => (
                                <Tags
                                    {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    user={this.state.user}
                                    page={1}
                                    studyListUrl="http://localhost:8000/study/"
                                    taggedStudyUrl="http://localhost:8000/tag/study?tag="
                                    taggedQuestionUrl="http://localhost:8000/tag/question?tag="
                                    studyItemPath="/study/"
                                    questionItemPath="/question/"
                                />
                            )}
                            />
                            <Route exact path="/tag/:tag/study" render={props => (
                                <Studies
                                    {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    user={this.state.user}
                                    page={1}
                                    studyListUrl="http://localhost:8000/study/"
                                    tagListUrl="http://localhost:8000/tag/"
                                />
                            )}
                            />
                            <Route exact path="/tag/:tag/question" render={props => (
                                <Questions
                                    {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    user={this.state.user}
                                    page={1}
                                    questionListUrl="http://localhost:8000/question/"
                                    tagListUrl="http://localhost:8000/tag/"
                                />
                            )}
                            />
                            <Route exact path="/question/new" render={props => (
                                <Authenticated
                                    {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    user={this.state.user}
                                    clearAuthInfo={this.clearAuthInfo}
                                >
                                    <NewQuestion
                                        {...props}
                                        loggedInStatus={this.state.loggedInStatus}
                                        user={this.state.user}
                                    />
                                </Authenticated>
                            )}
                            />
                            <Route exact path="/question/edit/:id" render={props => (
                                <Authenticated
                                    {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    user={this.state.user}
                                    clearAuthInfo={this.clearAuthInfo}
                                >
                                    <EditQuestion
                                        {...props}
                                        loggedInStatus={this.state.loggedInStatus}
                                        user={this.state.user}
                                        question={props.location.question}
                                    />
                                </Authenticated>
                            )}
                            />
                            <Route exact path="/question" render={props => (
                                <Questions
                                    {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    user={this.state.user}
                                    page={1}
                                    questionListUrl="http://localhost:8000/question/"
                                    tagListUrl="http://localhost:8000/tag/"
                                />
                            )}
                            />
                            <Route exact path="/question/:id" render={props => (
                                <QuestionDetail
                                    {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    user={this.state.user}
                                    question={props.location.question} />
                            )}
                            />
                            <Route exact path="/contact" render={props => (
                                <Contact
                                    {...props}
                                    loggedInStatus={this.state.loggedInStatus}
                                    user={this.state.user} />
                            )}
                            />
                            <Route exact path="/login" render={props => (
                                <Login
                                    {...props}
                                    handleLogin={this.handleLogin} />
                            )}
                            />
                            <Route exact path="/logout" render={props => (
                                <Logout
                                    {...props}
                                    handleLogout={this.handleLogout} />
                            )}
                            />
                            <Route exact path="/registration" render={props => (
                                <Registration
                                    {...props}
                                    handleRegistration={this.handleRegistration} />
                            )}
                            />
                            <Route path="/500" render={props => (
                                <Error
                                    {...props}
                                    errorCode={500} />
                            )}
                            />
                            <Route render={props => (
                                <Error
                                    {...props}
                                    errorCode={404} />
                            )}
                            />
                        </Switch>
                    </Router>
                </div>
            </div >
        );
    }
}

export default App;
