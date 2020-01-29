import React, { Component } from 'react'
import { Button, Divider, Form, Header, List } from 'semantic-ui-react'
import TagsInput from 'react-tagsinput';
import * as Utils from '../../utils/jwt'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './EditQuestion.css'


/* References */
// 1. react-tagsinput
// https://github.com/olahol/react-tagsinput

// 2. react-quill
// https://github.com/zenoamaro/react-quill


class EditQuestion extends Component {
    constructor(props) {
        super(props);

        this.state = {
            id: props.location.state.question.id,
            title: props.location.state.question.title,
            body: props.location.state.question.body,
            tags: props.location.state.question.tags
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

    handleToggleChange(event) {
        this.setState({
            [event.target.name]: event.target.checked
        });
    }

    handleSubmit(event) {
        const jwt = Utils.getJwt();

        const {
            id,
            title,
            body,
            tags
        } = this.state;
        console.log(tags);
        console.log(JSON.stringify({
            title: title,
            body: body,
            tags: tags
        }));
        event.preventDefault();

        fetch(
            'http://localhost:8000/question/'+id+"/", {
            method: 'PUT',
            headers: {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'application/json; charset="utf-8"'
            },
            body: JSON.stringify({
                title: title,
                body: body,
                tags: tags
            }),
            credentials: 'include'
        }
        )
            .then(
                response => (response.json())
            )
            .then(
                result => {
                    this.props.history.push('/question');
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
                <Header as="h2">Edit</Header>
                <Divider />
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
                            className='question-edit'
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
                    
                    <List className="list-checkbox-horizontal">

                    </List>

                    <Button type='submit' color="blue">Submit</Button>
                </Form>
            </div>
        )
    }
}

export default EditQuestion;