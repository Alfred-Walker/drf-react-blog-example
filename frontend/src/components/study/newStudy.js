import React, { Component } from 'react'
import { Button, Form, Header, List } from 'semantic-ui-react'
import TagsInput from 'react-tagsinput';
import './newStudy.css'
import * as helpers from '../helpers/jwt'

/* react-tagsinput reference */
/* https://github.com/olahol/react-tagsinput */

class NewStudy extends Component {
    constructor(props) {
        super(props);

        this.state = {
            title: "",
            body: "",
            tags: [],
            is_public: true,
            notification_enabled: false,
            review_cycle_in_minute: 12
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.handleToggleChange = this.handleToggleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleTagsChange(tags) {
        this.setState({tags});
    }

    handleToggleChange(event) {
        this.setState({
            [event.target.name]: event.target.checked
        });
    }

    handleSubmit(event) {
        const jwt = helpers.getJwt();

        const {
            title,
            body,
            tags,
            is_public,
            notification_enabled,
            review_cycle_in_minute
        } = this.state;
        console.log(tags);
        console.log(JSON.stringify({
            title: title,
            body: body,
            tags: tags,
            is_public: is_public,
            notification_enabled: notification_enabled,
            review_cycle_in_minute: review_cycle_in_minute
        }));
        event.preventDefault();

        fetch(
            'http://localhost:8000/study/', {
            method: 'POST',
            headers: {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'application/json; charset="utf-8"'
            },
            body: JSON.stringify({
                title: title,
                body: body,
                tags: tags,
                is_public: is_public,
                notification_enabled: notification_enabled,
                review_cycle_in_minute: review_cycle_in_minute
            }),
            credentials: 'include'
        }
        )
            .then(
                response => (response.json())
            )
            .then(
                result => {
                    this.props.history.push('list');
                }
            )
            .catch(
                err => console.log("login error", err)
            );

        // POST API here
    }

    render() {
        return (
            <div className="form">
                <Header as="h2">New Study</Header>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Field>
                        <label>Title</label>
                        <input
                            name='title'
                            placeholder='Title'
                            value={this.state.title}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Contents</label>
                        <Form.TextArea
                            name='body'
                            rows={10}
                            placeholder='Contents'
                            value={this.state.body}
                            onChange={this.handleChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Tags</label>
                        <TagsInput
                            name='tagsInput'
                            value={this.state.tags}
                            onChange={this.handleTagsChange}
                            addKeys={[9, 13, 188]}
                            onlyUnique={true} />
                    </Form.Field>
                    <Form.Field>
                        <Form.Checkbox
                            name='is_public'
                            defaultChecked={this.state.is_public}
                            onChange={this.handleToggleChange}
                            label='Is Public'
                            toggle
                        />
                        <Form.Checkbox
                            name='notification_enabled'
                            defaultChecked={this.state.notification_enabled}
                            onChange={this.handleToggleChange}
                            label='Notification Enabled'
                            toggle
                        />
                    </Form.Field>
                    <List className="list-checkbox-horizontal">

                    </List>

                    <Button type='submit' color="blue">Submit</Button>
                </Form>
            </div>
        )
    }
}

export default NewStudy;