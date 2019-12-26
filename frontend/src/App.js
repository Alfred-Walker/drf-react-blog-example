//frontend/src/app.js
import React, { Component } from 'react';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import Login from './login';
import NavigationBar from './navigation';
import StudyInfo from './studyInfo';
import NewStudyForm from './newStudy';
import Studies from './studies';
import ContactForm from './contact'
import { Link, Route, BrowserRouter as Router } from "react-router-dom";

class App extends Component {
    state = {
        response: [],
    };
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
                <Router>
                    <NavigationBar />

                    <div className="container">
                        <Route exact path="/" component={StudyInfo} />
                        <Route path="/study/new" component={NewStudyForm} />
                        <Route path="/study/list" component={Studies} />
                        <Route exact path="/contact" component={ContactForm} />
                    </div>
                </Router>
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
