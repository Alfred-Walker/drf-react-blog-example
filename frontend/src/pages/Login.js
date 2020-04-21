import React, { Component } from 'react'
import PropTypes from 'prop-types';
import LoginForm from './login/LoginForm';
import * as jwtUtil from '../utils/jwt';
import * as CSRF from '../utils/csrf';
import * as Urls from './Urls';


class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: undefined,
            password: undefined,
            error: undefined
        };

        this.onGenericChange = this.onGenericChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onGenericChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onSubmit(event) {
        const {
            email,
            password
        } = this.state

        event.preventDefault();

        var csrftoken = CSRF.getCookie('csrftoken');

        fetch(
            Urls.URL_JWT_AUTH, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset="utf-8"', 'X-CSRFToken': csrftoken },
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
                    if(result.token) {
                        jwtUtil.setJwt(result.token);
                        this.props.onLogin(result);

                        // TODO: need to fix for the case when users hit login page directly
                        this.props.history.goBack();
                    } else {
                        this.setState({'error': result})
                    }
                }
            )
            .catch(err => console.error("login error", err));
    }

    render() {
        return (
            <LoginForm
                onChange={this.onGenericChange}
                onSubmit={this.onSubmit}
                email={this.state.email}
                password={this.state.password}
                error={this.state.error}
            />
        );
    }
}

Login.propTypes = {
    history: PropTypes.object,
    onLogin: PropTypes.func
};

Login.defaultProps = {
    history: undefined,
    onLogin: undefined
};

export default Login;