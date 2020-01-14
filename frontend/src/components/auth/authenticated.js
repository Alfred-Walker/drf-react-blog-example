import React, { Component } from 'react';
import * as helpers from '../helpers/jwt';


class Authenticated extends Component {
    constructor(props) {
        super(props);

        this.state = {
            user: undefined
        }
    }

    handleVerificationSuccess() {
        console.log("token verified for an authenticated component")
    }

    handleVerificationFailure(err) {
        console.log("token verification failed: ", err);
        this.props.clearAuthInfo();
        this.props.history.push('/login');
    }

    componentDidMount() {
        const token = helpers.getJwt();
        const user = this.props.user;
        this.setState({user})

        if(!token || !user) {
            this.props.history.push('/login');
            return;
        }

        // verify existing token's life before POST
        var isExpired = helpers.isJwtExpired(token);
        
        if (isExpired) {
            localStorage.clear();
            this.props.history.push('/login');
            return;
        }

        fetch(
            "http://localhost:8000/jwt-auth/verify/", {
                method: 'POST',
                headers: {'Authorization': `JWT ${token}`, 'Content-Type':'application/json; charset="utf-8"'},
                body: JSON.stringify({
                    token: token,
                }),
                credentials: 'include'
            }
        )
        .then(
            response => (response.json())
        )
        .then(
            result => {
                this.handleVerificationSuccess();
            }
        )
        .catch(
            // TODO: need better catch. 
            err => {
                this.handleVerificationFailure(err);
            }
        );
    }

    render() {
        if(this.state.user === undefined) {
            return (
                <div><h1>Loading...</h1></div>
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