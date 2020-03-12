import React, { Component } from 'react'
import PropTypes from 'prop-types';
import RegistrationForm from './registration/RegistrationForm';
import * as Utils from '../utils/jwt';
import * as CSRF from '../utils/csrf';


class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            nickname: "",
            password: "",
            password_confirmation: "",
            registrationErrors: "",
            error: undefined
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
            nickname,
            password,
            password_confirmation
        } = this.state

        var csrftoken = CSRF.getCookie('csrftoken');

        fetch(
            'http://localhost:8000/rest-auth/registration/', {
                method: 'POST',
                headers: {'Content-Type':'application/json; charset="utf-8"', 'X-CSRFToken': csrftoken},
                body: JSON.stringify({
                    email: email,
                    nickname: nickname,
                    password1: password,
                    password2: password_confirmation
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
                    Utils.setJwt(result.token);
                    this.props.handleRegistration(result);
                    this.props.history.push('/');
                } else {
                    this.setState({'error': result})
                }
            }
        )
        .catch(err => console.log("registration error", err));
        
        event.preventDefault();
        // POST API here
    }

    render() {
        return (
            <RegistrationForm
                handleChange={this.handleGeneralChange}
                handleSubmit={this.handleSubmit}
                email={this.state.email}
                nickname={this.state.nickname}
                password={this.state.password}
                password_confirmation={this.state.password_confirmation}
                error={this.state.error}
            />
        );
    }
}

Registration.propTypes = {
    history: PropTypes.object,
    handleRegistration: PropTypes.func
};

Registration.defaultProps = {
    history: undefined,
    handleRegistration: undefined
};

export default Registration;