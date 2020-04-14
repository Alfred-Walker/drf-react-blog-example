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
import ErrorMessageList from '../../components/ErrorMessageList'


const RegistrationForm = (props) => {
    return (
        <Grid textAlign='center' style={{ height: '100vh' }} verticalAlign='middle'>
            <Grid.Column style={{ maxWidth: 450 }}>
                <Header as='h2' color='teal' textAlign='center'>
                    Register your account
                    </Header>
                <Form size='large' onSubmit={props.onSubmit}>
                    <CSRFToken />
                    <Segment stacked>
                        <Form.Input
                            name='email'
                            type='email'
                            fluid icon='user'
                            iconPosition='left'
                            placeholder='E-mail address'
                            onChange={props.onChange}
                            value={props.email}
                            required
                        />
                        {
                            props.error ?
                                <ErrorMessageList list={props.error.email} />
                                : ""
                        }
                        <Form.Input
                            name='nickname'
                            type='nickname'
                            fluid icon='user'
                            iconPosition='left'
                            placeholder='Nickname'
                            onChange={props.onChange}
                            value={props.nickname}
                            required
                        />
                        {
                            props.error ?
                                <ErrorMessageList list={props.error.nickname} />
                                : ""
                        }
                        <Form.Input
                            fluid
                            name='password'
                            type='password'
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password'
                            onChange={props.onChange}
                            value={props.password}
                            required
                        />
                        {
                            props.error ?
                                <ErrorMessageList list={props.error.password1} />
                                : ""
                        }
                        <Form.Input
                            fluid
                            name='password_confirmation'
                            type='password'
                            icon='lock'
                            iconPosition='left'
                            placeholder='Password Confirmation'
                            onChange={props.onChange}
                            value={props.password_confirmation}
                            required
                        />
                        {
                            props.error ?
                                <ErrorMessageList list={props.error.password2} />
                                : ""
                        }
                        {
                            props.error ?
                                <ErrorMessageList list={props.error.non_field_errors} />
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
    onChange: PropTypes.func,
    onSubmit: PropTypes.func,
    email: PropTypes.string,
    nickname: PropTypes.string,
    password: PropTypes.string,
    password_confirmation: PropTypes.string,
    error: PropTypes.object
};

RegistrationForm.defaultProps = {
    onChange: undefined,
    onSubmit: undefined,
    email: "",
    nickname: "",
    password: "",
    password_confirmation: "",
    error: undefined
};

export default RegistrationForm;