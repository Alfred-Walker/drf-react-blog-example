import React, { Component } from 'react'
import { Button, Form, Header, List } from 'semantic-ui-react'
import TagsInput from 'react-tagsinput';
import * as Utils from '../../utils/jwt'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './NewStudy.css'

/* References */
// 1. react-tagsinput
// https://github.com/olahol/react-tagsinput

// 2. react-quill
// https://github.com/zenoamaro/react-quill


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

        this.handleGenericChange = this.handleGenericChange.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.handleToggleChange = this.handleToggleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleGenericChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleEditorChange(value) {
        this.setState({ body: value })
    }

    handleTagsChange(tags) {
        this.setState({tags});
    }

    handleToggleChange(e, { name, checked }) {
        this.setState({
            [name]: checked
        });
        // see Semantic UI docs.
        // https://react.semantic-ui.com/collections/form/#usage-capture-values
        // console.log("name", name)
        // console.log("checked", checked)
    }

    handleSubmit(event) {
        const jwt = Utils.getJwt();

        const {
            title,
            body,
            tags,
            is_public,
            notification_enabled,
            review_cycle_in_minute
        } = this.state;

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
                    console.log("is_public", is_public)
                    this.props.history.push('/study');
                }
            )
            .catch(
                err => console.log("login error", err)
            );
    }

    modules = {
        toolbar: {
          container: [
            ["bold", "italic", "underline", "strike", "blockquote"],
            [{ size: ["small", false, "large", "huge"] }, { color: [] }],
            [
              { list: "ordered" },
              { list: "bullet" },
              { indent: "-1" },
              { indent: "+1" },
              { align: [] }
            ],
            ["link", "image", "video", "code-block"],
            ["clean"]
          ],
          handlers: { image: this.imageHandler }
        },
        clipboard: { matchVisual: false }
      };

      formats = [
        "header",
        "bold",
        "italic",
        "underline",
        "strike",
        "blockquote",
        "size",
        "color",
        "list",
        "bullet",
        "indent",
        "link",
        "image",
        "video",
        "align",
        "code",
        "code-block"
      ];

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
                            onChange={this.handleGenericChange}
                        />
                    </Form.Field>
                    <Form.Field>
                        <label>Contents</label>
                        <ReactQuill
                            className='study-new'
                            name='body'
                            theme='snow'
                            modules={this.modules}
                            formats={this.formats}
                            placeholder='Contents'
                            value={this.state.body}
                            onChange={this.handleEditorChange}
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