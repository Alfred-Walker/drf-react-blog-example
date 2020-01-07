import React from 'react'
import { Button, Form, Segment, Header } from 'semantic-ui-react'

/* Tutorial Reference*/
/* https://reactgo.com/semantic-ui-react/ */
function ContactForm(props) {
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
export default ContactForm;