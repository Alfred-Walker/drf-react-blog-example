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

import { Route, BrowserRouter as Router, Switch } from "react-router-dom";
import Authenticated from './app/Authenticated';
import * as jwtUtil from '../utils/jwt';
import Error from './Error'




class App extends Component {
    constructor() {
        super();

        this.state = {
            loggedInStatus: "NOT_LOGGED_IN",
            user: undefined
        }

        this.clearAuthInfo = this.clearAuthInfo.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.onRegistration = this.onRegistration.bind(this);
        this.onTokenRefreshSuccess = this.onTokenRefreshSuccess.bind(this);
    }

    clearAuthInfo() {
        localStorage.clear();
        this.setState({
            loggedInStatus: "NOT_LOGGED_IN",
            user: undefined
        });
    }

    initializeAuthInfo() {
        const token = jwtUtil.getJwt();

        // clear localStorage if there is no access token
        if (!token || token === 'undefined') {
            localStorage.clear();
            return;
        }

        // verify existing token's life before POST
        const isExpired = jwtUtil.isJwtExpired(token);

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
                    this.onTokenRefreshSuccess(result);
                }
            )
            .catch(err => {
                this.onTokenRefreshFailure();
            }
            );
    }

    componentDidMount() {
        this.initializeAuthInfo();
    }

    onLogin(data) {
        this.setState({
            loggedInStatus: "LOGGED_IN",
            user: data.user
        });
    }

    onLogout(data) {
        this.clearAuthInfo();
    }

    onRegistration(data) {
        localStorage.setItem("jwt-token", data.token);
        this.setState({
            loggedInStatus: "LOGGED_IN",
            user: data.user
        });
    }

    onTokenRefreshSuccess(data) {
        localStorage.setItem("jwt-token", data.token);
        this.setState({
            loggedInStatus: "LOGGED_IN",
            user: data.user
        });
    }

    onTokenRefreshFailure(data) {
        this.clearAuthInfo();
    }

    render() {
        return (
            <div className="App">
                <div className="container">
                    <Router>
                        <NavigationBar loggedInStatus={this.state.loggedInStatus} >
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

                            <Route exact path="/login" render={props => (
                                <Login
                                    {...props}
                                    onLogin={this.onLogin} />
                            )}
                            />
                            <Route exact path="/logout" render={props => (
                                <Logout
                                    {...props}
                                    onLogout={this.onLogout} />
                            )}
                            />
                            <Route exact path="/registration" render={props => (
                                <Registration
                                    {...props}
                                    onRegistration={this.onRegistration} />
                            )}
                            />
                            <Route path="/500" render={props => (
                                <Error
                                    {...props}
                                    errorCode={'500'} />
                            )}
                            />
                            <Route path="/401" render={props => (
                                <Error
                                    {...props}
                                    errorCode={'401'} />
                            )}
                            />
                            <Route path="/403" render={props => (
                                <Error
                                    {...props}
                                    errorCode={'403'} />
                            )}
                            />
                            <Route render={props => (
                                <Error
                                    {...props}
                                    errorCode={'404'} />
                            )}
                            />
                        </Switch>
                        </NavigationBar>
                    </Router>
                </div>
            </div >
        );
    }
}

export default App;
