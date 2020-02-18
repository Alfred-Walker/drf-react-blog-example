import React from 'react'
import ReactQuill from 'react-quill';
import PropTypes from 'prop-types';
import TagsInput from 'react-tagsinput';
import { Divider, Header, Icon, Label, List, Segment } from 'semantic-ui-react'


function ReadOnlyQuillSegment(props) {
    /* quill editor without toolbar */
    const modules = {
        toolbar: false,
        clipboard: { matchVisual: false }
    };

    /* quill editor format */
    const formats = [
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

    /* tagsInput properties */
    const tagsInputProps = {
        className: 'react-tagsinput-input',
        placeholder: ''
    }

    return (
        <Segment style={{'border': 1, 'outline': 'none'}}>
            <Header as="h1">
                {props.title}{props.is_public ? "" : <Label className="ui horizontal red">Private</Label>}
            </Header>
            <Divider />
            <ReactQuill
                modules={modules}
                formats={formats}
                value={props.body}
                readOnly={true}
                theme={"snow"}
            />
            <br />
            <p>
                <Icon name='user' />{props.nickname} &nbsp;&nbsp;/&nbsp;&nbsp; {props.registered_date}
            </p>
            <List className="list-tag-horizontal">
                <TagsInput in
                    disabled={true}
                    value={props.tags}
                    inputProps={tagsInputProps}
                />
            </List>
        </Segment>
    )
}

ReadOnlyQuillSegment.propTypes = {
    is_public: PropTypes.bool,
    title: PropTypes.string,
    body: PropTypes.string,
    nickname: PropTypes.string,
    registered_date: PropTypes.string,
    tags: PropTypes.array
};

ReadOnlyQuillSegment.defaultProps = {
    is_public: true,
    title: "title nonamed",
    body: "(empty)",
    nickname: "",
    registered_date: "",
    tags: []
};

export default ReadOnlyQuillSegment;
