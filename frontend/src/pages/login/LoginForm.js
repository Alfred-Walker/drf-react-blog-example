import React from 'react'
import PropTypes from 'prop-types';
import {
    Button,
    Form,
    Grid,
    Header,
    Message,
    Segment
} from 'semantic-ui-react'


const LoginForm = (props) => {
    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    Login to your account
                    </Header>
                <Form size='large' onSubmit={props.handleSubmit}>
                    <Segment stacked>
                        <Form.Input
                            name='email'
                            type='email'
                            onChange={props.handleChange}
                            value={props.email}
                            fluid icon='user'
                            iconPosition='left'
                            placeholder='E-mail address'
                            required
                        />
                        <Form.Input
                            fluid
                            name='password'
                            type='password'
                            onChange={props.handleChange}
                            value={props.password}
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            required
                        />

                        <Button color='teal' fluid size='large'>
                            Login
                        </Button>
                    </Segment>
                </Form>
                <Message>
                    New to us? <a href='/registration'>Sign Up</a>
                </Message>
            </Grid.Column>
        </Grid>
    )
}

LoginForm.propTypes = {
    handleChange: PropTypes.func, 
    handleSubmit: PropTypes.func,
    email: PropTypes.string,
    password: PropTypes.string
};

LoginForm.defaultProps = {
    handleChange: undefined, 
    handleSubmit: undefined,
    email: "",
    password: ""
};

export default LoginForm;