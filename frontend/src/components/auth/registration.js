import React, { Component } from 'react'
import { Button, Form, Grid, Header, Message, Segment } from 'semantic-ui-react'


class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: "",
            password_confirmation: "",
            registrationErrors: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        const {
            email,
            password,
            password_confirmation
        } = this.state

        fetch(
            'http://localhost:8000/jwt-auth/', {
                method: 'POST',
                headers: {'Content-Type':'application/json; charset="utf-8"'},
                body: JSON.stringify({
                    email: email,
                    password: password,
                }),
                credentials: 'include'
            }
        )
        .then(response => console.log("registration response", response.json()))
        .catch(err => console.log("registration error", err));
        
        event.preventDefault();
        // POST API here
    }

    render() {
        return (
            <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
                <Grid.Column style={{ maxWidth: 450 }}>
                    <Header as='h2' color='teal' textAlign='center'>
                        Register your account
                    </Header>
                    <Form size='large' onSubmit={this.handleSubmit}>
                        <Segment stacked>
                            <Form.Input
                                name='email'
                                type='email'
                                fluid icon='user'
                                iconPosition='left'
                                placeholder='E-mail address'
                                onChange={this.handleChange}
                                value={this.state.email}
                                required
                            />
                            <Form.Input
                                fluid
                                name='password'
                                type='password'
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password'
                                onChange={this.handleChange}
                                value={this.state.password}
                                required
                            />
                            <Form.Input
                                fluid
                                name='password_confirmation'
                                type='password'
                                icon='lock'
                                iconPosition='left'
                                placeholder='Password Confirmation'
                                onChange={this.handleChange}
                                value={this.state.password_confirmation}
                                required
                            />

                            <Button color='teal' fluid size='large'>
                                Sign Up
                            </Button>
                        </Segment>
                    </Form>
                    <Message>
                        Any problems? Please <a href='/contact'>contact</a> us, then we can help you better.
                    </Message>
                </Grid.Column>
            </Grid>
        );
    }
}

export default Registration;