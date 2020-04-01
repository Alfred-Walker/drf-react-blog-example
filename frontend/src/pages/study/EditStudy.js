import React, { Component } from 'react'
import { Button, Divider, Form, Header, List } from 'semantic-ui-react'
import TagsInput from 'react-tagsinput';
import handleHttpResponseError from '../../utils/httpResponseError';
import base64Util from '../../utils/base64'
import jwtUtil from '../../utils/jwt';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './EditStudy.css'
import { CSRFToken } from '../../utils/csrf';
import { QuillFormats, QuillModules } from './quill/Editor'
import ErrorMessage from '../../components/ErrorMessage'


/* References */
// 1. react-tagsinput
// https://github.com/olahol/react-tagsinput

// 2. react-quill
// https://github.com/zenoamaro/react-quill


class EditStudy extends Component {
    constructor(props) {
        super(props);

        // reference for the ReactQuill
        // https://reactjs.org/docs/refs-and-the-dom.html
        this.editorRef = React.createRef();

        this.state = {
            id: props.location.state.study.id,
            title: props.location.state.study.title,
            body: props.location.state.study.body,
            tags: props.location.state.study.tags,
            is_public: props.location.state.study.is_public,
            notification_enabled: props.location.state.study.notification_enabled,
            review_cycle_in_minute: props.location.state.study.review_cycle_in_minute,
            submitEnabled: true,
            error: undefined
        }

        this.checkSubmitEnabled = this.checkSubmitEnabled.bind(this);
        this.handleGenericChange = this.handleGenericChange.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind(this);
        this.handleTagsChange = this.handleTagsChange.bind(this);
        this.handleToggleChange = this.handleToggleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleImageInsert = this.handleImageInsert.bind(this);
    }

    componentDidMount() {
        var quillEditor = this.editorRef.getEditor();
        quillEditor.getModule('toolbar')
            .addHandler('image', () => this.handleImageInsert());

        this.initialInput = JSON.stringify(quillEditor.getContents());
    }

    checkSubmitEnabled(title, body) {
        var editor = this.editorRef.getEditor();
        var contents = editor.getContents();

        if (!title || JSON.stringify(contents) === this.initialInput) {
            this.setState({ submitEnabled: false });
        }
        else {
            this.setState({ submitEnabled: true });
        }
    }

    handleGenericChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });

        if (event.target.name === "title")
            this.checkSubmitEnabled(event.target.value, this.state.body);
    }

    handleEditorChange(value) {
        this.setState({ body: value });
        this.checkSubmitEnabled(this.state.title, value);
    }

    handleTagsChange(tags) {
        this.setState({ tags });
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

    handleError(header, contents) {
        this.setState({ error: { 'header': header, 'contents': contents } });
    }

    handleImageInsert() {
        const input = document.createElement('input');
        input.setAttribute('type', 'file');
        input.setAttribute('accept', 'image/*');
        input.click();

        input.onchange = () => {
            const file = input.files[0];

            // file type is only image
            if (/^image\//.test(file.type)) {
                var reader = new FileReader();

                reader.onload = () => {
                    const range = this.editorRef.getEditor().getSelection();
                    this.editorRef.getEditor().insertEmbed(range.index, 'image', reader.result);
                }

                reader.readAsDataURL(file);
            } else {
                this.handleError('Upload Error', 'You could only upload images.');
                console.error('You could only upload images.');
            }
        };

        this.checkSubmitEnabled(this.state.title, this.state.body);
    }

    fetchFormData(formData) {
        const jwt = jwtUtil.getJwt();

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
            .catch(
                error => {
                    throw new Error(error);
                }
            )
    }

    fetchStudyData(quillEditor, imgUrls, state) {
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

        const jwt = jwtUtil.getJwt();

        const {
            id,
            title,
            tags,
            is_public,
            notification_enabled,
            review_cycle_in_minute
        } = state;

        // update body html
        const body = editor.root.innerHTML;
        this.setState({ body: body });

        return fetch(
            'http://localhost:8000/study/' + id + "/", {
            method: 'PUT',
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
            .catch(
                error => {
                    throw new Error(error);
                }
            )
    }

    handleSubmit(event) {
        event.preventDefault();

        var quillEditor = this.editorRef.getEditor();
        var base64Encoded = base64Util.getBase64UrlsFromContents(quillEditor);

        Promise.all(base64Encoded.map(imgSrcUrl => fetch(imgSrcUrl)))
            .then(responses => base64Util.getImgBlobs(responses))
            .then(blobs => base64Util.getFormDataForBlobs(blobs, 'images'))
            .then(formData => this.fetchFormData(formData))
            .then(handleHttpResponseError)
            .then(response => response.json())
            .then(results => {
                var urls = results.images.map(image => image.file_url);

                this.fetchStudyData(quillEditor, urls, this.state)
                    .then(handleHttpResponseError)
                    .then(response => response.json())
                    .then(() => this.props.history.push('/study'))
                    .catch(error => console.log("fetchStudyData error: ", error))
            })

            .catch(error => this.props.history.push('/' + error.message))
    }

    render() {
        return (
            <div className="form">
                <Header as="h2">Edit</Header>
                <Divider />
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
                            className='study-edit'
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
                    <Form.Field>
                        <Form.Checkbox
                            name='is_public'
                            checked={this.state.is_public}
                            onChange={this.handleToggleChange}
                            label='Is Public'
                            toggle
                        />
                        <Form.Checkbox
                            name='notification_enabled'
                            checked={this.state.notification_enabled}
                            onChange={this.handleToggleChange}
                            label='Notification Enabled'
                            toggle
                        />
                    </Form.Field>
                    <List className="list-checkbox-horizontal">

                    </List>
                    {
                        this.state.submitEnabled ?
                            <Button type='submit' color="blue">Submit</Button> :
                            <Button type='submit' color="blue" disabled >Submit</Button>
                    }
                </Form>

                {
                    this.state.error ?
                        <ErrorMessage header={this.state.error.header} contents={this.state.error.contents} />
                        : ""
                }
            </div>
        )
    }
}

export default EditStudy;