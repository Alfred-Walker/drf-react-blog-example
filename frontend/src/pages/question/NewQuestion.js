import React, { Component } from 'react'
import { Button, Form, Header, List } from 'semantic-ui-react'
import TagsInput from 'react-tagsinput';
import * as jwtUtils from '../../utils/jwt'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './NewQuestion.css'
import { CSRFToken } from '../../utils/csrf';
import { QuillFormats, QuillModules } from './quill/Editor'

/* References */
// 1. react-tagsinput
// https://github.com/olahol/react-tagsinput

// 2. react-quill
// https://github.com/zenoamaro/react-quill


class NewQuestion extends Component {
    constructor(props) {
        super(props);

        // reference for the ReactQuill
        // https://reactjs.org/docs/refs-and-the-dom.html
        this.editorRef = React.createRef();

        this.state = {
            title: "",
            body: "",
            tags: [],
            submitEnabled: false
        }

        this.checkSubmitEnabled = this.checkSubmitEnabled.bind(this);
        this.handleGenericChange = this.handleGenericChange.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.handleToggleChange = this.handleToggleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    checkSubmitEnabled(title, body) {
        if(!title || body.replace(/<(.|\n)*?>/g, '').trim().length === 0) {
            // textarea is empty when all tags are removed
            this.setState({ submitEnabled: false });
        }
        else{
            this.setState({ submitEnabled: true });
        }
    }

    handleGenericChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });

        if(event.target.name === "title")
            this.checkSubmitEnabled(event.target.value, this.state.body);
    }

    handleEditorChange(value) {
        this.setState({ body: value })
        this.checkSubmitEnabled(this.state.title, value);
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

    fetchFormData(formData) {
        const jwt = jwtUtils.getJwt();

        return fetch(
            'http://localhost:8000/image/', {
            method: 'POST',
            headers: {
                'Authorization': `JWT ${jwt}`,
            },
            body: formData,
            credentials: 'include'
        }
        )
    }

    fetchQuestionData(quillEditor, imgUrls, state) {
        var editor = quillEditor;
        var contents = editor.getContents();
        var ops = contents.ops;

        if (ops && imgUrls) {
            var index = 0;

            // assign new image src urls to existing image urls
            for (var op in ops) {
                if (ops[op].insert && ops[op].insert.image) {
                    ops[op].insert.image = imgUrls[index];
                    index += 1;
                }
            }

            // assign modified ops
            contents.ops = ops;

            // apply modified contents
            editor.setContents(contents);
        }

        const jwt = jwtUtils.getJwt();

        const {
            title,
            tags
        } = this.state;

        // update body html
        const body = editor.root.innerHTML;
        this.setState({ body: body });

        return fetch(
            'http://localhost:8000/question/', {
            method: 'POST',
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
    }

    getBase64EncodedUrls(quillEditor) {
        var editor = quillEditor;
        const contents = editor.getContents();

        var ops = contents.ops;
        var base64Encoded = new Array;

        if (ops) {
            for (var op in ops) {
                if (ops[op].insert && ops[op].insert.image) {
                    base64Encoded.push(ops[op].insert.image);
                }
            }
        }

        return base64Encoded;
    }

    handleSubmit(event) {
        event.preventDefault();

        var quillEditor = this.editorRef.getEditor();
        var base64Encoded = this.getBase64EncodedUrls(quillEditor);
        
        Promise.all(base64Encoded.map(imgSrcUrl => fetch(imgSrcUrl)))
            .then(responses => Promise.all(responses.map(res => res.blob()))
                .then(blobs => {
                    var formData = new FormData();
                    blobs.map(blob => formData.append('images', blob));
                    return formData;
                }
                )
                .then(formData => this.fetchFormData(formData))
                .then(response => response.json())
                .then(results => {
                    var urls = results.images.map(image => image.file_url);

                    this.fetchQuestionData(quillEditor, urls, this.state)
                        .then(result => this.props.history.push('/question'))
                        .catch(err => console.log("fetchQuestionData error: ", err))
                })

                .catch(err => console.log("fetchFormData error: ", err))
            )
    }

    render() {
        return (
            <div className="form">
                <Header as="h2">New Question</Header>
                <Form onSubmit={this.handleSubmit}>
                    <CSRFToken />
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
                            className='question-new'
                            name='body'
                            theme='snow'
                            modules={QuillModules}
                            formats={QuillFormats}
                            placeholder='Contents'
                            value={this.state.body}
                            onChange={this.handleEditorChange}
                            ref={(r) => { this.editorRef = r }}
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
                    {
                        this.state.submitEnabled ? 
                        <Button type='submit' color="blue">Submit</Button> :
                        <Button type='submit' color="blue" disabled >Submit</Button>
                    }
                </Form>
            </div>
        )
    }
}

export default NewQuestion;