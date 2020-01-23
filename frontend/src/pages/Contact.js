import React from 'react'
import PropTypes from 'prop-types';
import { 
    Button, 
    Form, 
    Header 
} from 'semantic-ui-react'


const Contact = (props) => {
    return (
        <div className="form">
            <Header as="h2">Contact</Header>
            <Form>
                <Form.Field>
                    <label>First Name</label>
                    <input placeholder='First Name' />
                </Form.Field>
                <Form.Field>
                    <label>Last Name</label>
                    <input placeholder='Last Name' />
                </Form.Field>
                <Form.TextArea rows={5} label='About'
                placeholder='Ask me anything you want' />
                <Button type='submit' color="blue">Submit</Button>
            </Form>
        </div>
    )
}

Contact.propTypes = {
    user: PropTypes.object
};

Contact.defaultProps = {
    user: undefined
};

export default Contact;