import React, { Component } from 'react'
import PropTypes from 'prop-types';
import LoginForm from './login/LoginForm';
import * as Utils from '../utils/jwt';


class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: undefined,
            password: undefined
        };

        this.handleGeneralChange = this.handleGeneralChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleGeneralChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        const {
            email,
            password
        } = this.state

        event.preventDefault();

        fetch(
            'http://localhost:8000/jwt-auth/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset="utf-8"' },
            body: JSON.stringify({
                email: email,
                password: password,
            }),
            credentials: 'include'
        }
        )
            .then(
                response => (response.json())
            )
            .then(
                result => {
                    Utils.setJwt(result.token);
                    this.props.handleLogin(result);
                    this.props.history.push('/');
                }
            )
            .catch(
                err => console.log("login error", err)
            );
    }

    render() {
        return (
            <LoginForm
                handleChange={this.handleGeneralChange}
                handleSubmit={this.handleSubmit}
                email={this.state.email}
                password={this.state.password}
            />
        );
    }
}

Login.propTypes = {
    history: PropTypes.object,
    handleLogin: PropTypes.func
};

Login.defaultProps = {
    history: undefined,
    handleLogin: undefined
};

export default Login;