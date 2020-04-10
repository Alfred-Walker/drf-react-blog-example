import React, { Component } from 'react'
import PropTypes from 'prop-types';
import RegistrationForm from './registration/RegistrationForm';
import * as jwtUtil from '../utils/jwt';
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
            nickname,
            password,
            password_confirmation
        } = this.state

        var csrftoken = CSRF.getCookie('csrftoken');

        event.preventDefault();

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
                    jwtUtil.setJwt(result.token);
                    this.props.onRegistration(result);
                    this.props.history.push('/');
                } else 
                    this.setState({'error': result});
            }
        )
        .catch(err => console.error("registration error", err));
    }

    render() {
        return (
            <RegistrationForm
                onChange={this.onGenericChange}
                onSubmit={this.onSubmit}
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
    onRegistration: PropTypes.func
};

Registration.defaultProps = {
    history: undefined,
    onRegistration: undefined
};

export default Registration;