import React, { Component } from 'react';
import { getJwt } from '../helpers/jwt';


class Authenticated extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: undefined
        }
    }

    componentDidMount() {
        const jwt = getJwt();
        const userUrl = this.props.userUrl;

        if(!jwt || !userUrl) {
            this.props.history.push('/');
        }

        fetch(
            userUrl, {
                method: 'GET',
                headers: {'Authorization': `JWT ${jwt}`},
                credentials: 'include'
            }
        )
        .then(
            response => (response.json())
        )
        .then(
            result => {
                this.setState({
                    email: result.email
                });
            }
        )
        .catch(
            // TODO: need better catch. 
            err => {
                console.log("login error");
                console.log(err);
                localStorage.removeItem('jwt-token');
                this.props.history.push('/login');
            }
        );
    }

    render() {
        if(this.state.email === undefined) {
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