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
import { CSRFToken } from '../../utils/csrf';
import ErrorMessage from '../../components/ErrorMessage'


const RegistrationForm = (props) => {
    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    Register your account
                    </Header>
                <Form size='large' onSubmit={props.handleSubmit}>
                    <CSRFToken />
                    <Segment stacked>
                        <Form.Input
                            name='email'
                            type='email'
                            fluid icon='user'
                            iconPosition='left'
                            placeholder='E-mail address'
                            onChange={props.handleChange}
                            value={props.email}
                            required
                        />
                        {
                            props.error ?
                                <ErrorMessage list={props.error.email} />
                                : ""
                        }
                        <Form.Input
                            fluid
                            name='password'
                            type='password'
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            onChange={props.handleChange}
                            value={props.password}
                            required
                        />
                        {
                            props.error ?
                                <ErrorMessage list={props.error.password1} />
                                : ""
                        }
                        <Form.Input
                            fluid
                            name='password_confirmation'
                            type='password'
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password Confirmation'
                            onChange={props.handleChange}
                            value={props.password_confirmation}
                            required
                        />
                        {
                            props.error ?
                                <ErrorMessage list={props.error.password2} />
                                : ""
                        }
                        {
                            props.error ?
                                <ErrorMessage list={props.error.non_field_errors} />
                                : ""
                        }


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
    )
}

RegistrationForm.propTypes = {
    handleChange: PropTypes.func,
    handleSubmit: PropTypes.func,
    email: PropTypes.string,
    password: PropTypes.string,
    password_confirmation: PropTypes.string,
    error: PropTypes.object
};

RegistrationForm.defaultProps = {
    handleChange: undefined,
    handleSubmit: undefined,
    email: "",
    password: "",
    password_confirmation: "",
    error: undefined
};

export default RegistrationForm;