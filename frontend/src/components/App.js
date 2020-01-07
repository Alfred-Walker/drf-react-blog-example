//frontend/src/app.js
import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import Login from './auth/login';
import Registration from './auth/registration';
import NavigationBar from './navigation';
import StudyInfo from './study/studyInfo';
import NewStudyForm from './study/newStudy';
import Studies from './study/studies';
import ContactForm from './contact'
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

class App extends Component {
    constructor() {
        super();

        this.state = {
            loggedInStatus: "NOT_LOGGED_IN",
            user: {},
            response: []
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.handleSuccessfulAuth = this.handleSuccessfulAuth.bind(this);
    }

    handleLogin(data) {
        this.setState({
            loggedInStatus: "LOGGED_IN",
            user: data.user
        });
    }

    handleSuccessfulAuth(data) {
        // TODO update parent component
        this.props.handleLogin(data);
        this.props.history.push("/study/list")
    }

    /*
        async componentDidMount() {
            try {
                const res = await fetch('http://127.0.0.1:8000/users/');
                const response = await res.json();
                console.log(response)
                this.setState({ response });
            } catch (e) {
                console.log(e);
            }
        }
    */
    render() {
        return (
            <div className="App">
                <div className="container">
                    <Router>
                        <NavigationBar loggedInStatus={this.state.loggedInStatus} />
                        <Switch>
                            <Route exact path="/" render={props => (
                                <StudyInfo {...props} handleLogin={this.handleLogin} loggedInStatus={this.state.loggedInStatus} />
                            )}
                            />
                            <Route exact path="/study/new" render={props => (
                                <NewStudyForm {...props} loggedInStatus={this.state.loggedInStatus} />
                            )}
                            />
                            <Route exact path="/study/list" render={props => (
                                <Studies {...props} loggedInStatus={this.state.loggedInStatus} />
                            )}
                            />
                            <Route exact path="/contact" render={props => (
                                <ContactForm {...props} loggedInStatus={this.state.loggedInStatus} />
                            )}
                            />
                            <Route exact path="/login" render={props => (
                                <Login {...props} loggedInStatus={this.state.loggedInStatus} />
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
