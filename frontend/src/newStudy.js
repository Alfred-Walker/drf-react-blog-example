import React from 'react'
import { Button, Form, Segment, Header, Label, List } from 'semantic-ui-react'


function NewStudyForm(props) {
    return (
        <div className="form">
            <Header as="h2">New Study</Header>
            <Form>
                <Form.Field>
                    <label>Title</label>
                    <input placeholder='Title' />
                </Form.Field>
                <Form.Field>
                    <label>Contents</label>
                    <Form.TextArea rows={10} placeholder='Contents' />
                </Form.Field>
                <Form.Field>
                    <label>Tags</label>
                    <Form.Input placeholder='Tags' />
                </Form.Field>
                <Form.Field>
                    <Form.Checkbox label='Private' toggle/>
                    <Form.Checkbox label='Notification' toggle/>
                </Form.Field>
                <List className="list-checkbox-horizontal">

                </List>

                <Button type='submit' color="blue">Submit</Button>
            </Form>
        </div>
    )
}
export default NewStudyForm;