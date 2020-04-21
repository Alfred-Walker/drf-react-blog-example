import React, { Component } from 'react';
import * as helpers from '../../utils/jwt';
import { Dimmer, Loader } from 'semantic-ui-react'
import handleHttpResponseError from '../../utils/httpResponseError';
import * as Urls from '../Urls';


class Authenticated extends Component {
    constructor(props) {
        super(props);

        this.state = { isLoading: true };
    }

    handleVerificationSuccess() {
        this.setState({ isLoading: false });
    }

    handleVerificationFailure(err) {
        this.props.clearAuthInfo();
        this.props.history.push('/login');
    }

    componentDidMount() {
        const token = helpers.getJwt();

        if (!token) {
            this.props.history.push('/login');
            return;
        }

        var isExpired = helpers.isJwtExpired(token);

        if (isExpired) {
            localStorage.clear();
            this.props.history.push('/login');
            return;
        }

        fetch(
            Urls.URL_JWT_AUTH_VERIFY, {
            method: 'POST',
            headers: { 'Authorization': `JWT ${token}`, 'Content-Type': 'application/json; charset="utf-8"' },
            body: JSON.stringify({
                token: token,
            }),
            credentials: 'include'
        }
        )
            .then(handleHttpResponseError)
            .then(response => response.json())
            .then(result => this.handleVerificationSuccess())
            .catch(
                err => {
                    this.handleVerificationFailure(err);
                }
            );
    }

    render() {
        if (this.state.isLoading) {
            return (
                <Dimmer active>
                    <Loader>Loading</Loader>
                </Dimmer>
            );
        }

        return (
            <div>
                {this.props.children}
            </div>
        )
    }
}

export default Authenticated;