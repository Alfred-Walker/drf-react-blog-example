import React, { Component } from 'react';
import { Button, Confirm, Dimmer, Divider, Grid, GridColumn, Header, Label, List, Loader, Message, Segment } from 'semantic-ui-react';
import { getJwt } from '../helpers/jwt';
import TagsInput from 'react-tagsinput';
import './studies.css';
import ReactQuill from 'react-quill';
import { Link } from "react-router-dom";
import * as helpers from '../helpers/jwt'

class Studies extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            index: 0,
            studyList: undefined,
        }

        this.tagsInputProps = {
            className: 'react-tagsinput-input',
            placeholder: ''
          }

        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.deleteStudyFromList = this.deleteStudyFromList.bind(this);
    }

    deleteStudyFromList(id) {
        this.setState(
                {
                    studyList: this.state.studyList.filter(
                        function(study) {
                            return study.id !== Number(id);
                    }
                )
            }
        );
    }

    handleCancel = () => this.setState({ open: false })

    handleChange(tags) {
        this.setState({ tags });
    }

    handleDelete(event) {
        const jwt = helpers.getJwt();
        const id = this.state.id;
        
        this.setState({ open: false });
        event.preventDefault();

        fetch(
            'http://localhost:8000/study/'+id+"/", {
            method: 'DELETE',
            headers: {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'application/json; charset="utf-8"'
            },
            credentials: 'include'
        }
        )
        .then(
            response => this.deleteStudyFromList(id)
        )
        .catch(
            err => console.log("delete error", err)
        );
    }

    handleShow(event) {
        const id = event.target.name;
        this.setState({ open: true, id: id })
    }

    componentDidMount() {
        let headers = {};
        const jwt = getJwt();

        if (jwt) {
            headers = { 
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'Application/json'
            };
        }

        const studyListUrl = this.props.studyListUrl;

        fetch(
            studyListUrl, {
            method: 'GET',
            headers: headers,
            credentials: 'include'
        }
        )
            .then(
                response => (response.json())
            )
            .then(
                result => {
                    this.setState({
                        studyList: result.results
                    });
                }
            )
            .catch(
                // TODO: need better catch.
                err => {
                    console.log("studies error", err);
                    this.props.history.push('/');
                }
            );
    }

    // quill editor without toolbar
    modules = {
        toolbar: false,
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
        if (this.state.studyList === undefined) {
            return (
                <Dimmer active>
                    <Loader>Loading</Loader>
                </Dimmer>
            );
        }

        if (this.state.studyList.length === 0) {
            return (
                <GridColumn className='study-empty' >
                    <Header className='header'>&nbsp;NO DATA</Header> 
                    <Label className='label'>&nbsp;STUDY NOT FOUND</Label> 
                    <Divider />
                    <Message className='message'>
                        There is no study accessible. <br />
                        How about your own?
                    </Message> 
                    <Button as={Link} to={{ pathname: '/study/new/' }} primary basic>ADD YOUR STUDY</Button>
                </GridColumn> 
            );
        }

        return (
            <Grid centered columns={1} doubling> {
                this.state.studyList.map(study =>
                    <Grid.Column key={study.id}>
                        <Segment>
                            <Header as="h1">
                                {study.title}{study.is_public ? "" : <Label className="ui horizontal red">Private</Label>}
                            </Header>
                            <Divider />
                            <ReactQuill 
                                modules={this.modules}
                                formats={this.formats}
                                value={study.body} 
                                readOnly={true}
                                theme={"snow"}
                            />
                            <p>
                            {study.registered_date}
                            </p>
                            <p>{study.excerpt}</p>
                            <List className="list-tag-horizontal">
                                <TagsInput in
                                disabled={true} 
                                value={study.tags}
                                inputProps={this.tagsInputProps}
                                />
                            </List>
                            <Button primary basic as="a" href="/">See all</Button>
                            <Button as={Link} to={{ pathname: '/study/edit/'+study.id, state: { study: study} }} primary basic>Edit</Button>
                            <Button name={study.id} onClick={this.handleShow} primary basic negative>Delete</Button>
                            <Confirm
                                open={this.state.open}
                                content='Do you really want to delete?'
                                onCancel={this.handleCancel}
                                onConfirm={this.handleDelete}
                            />
                        </Segment>
                    </Grid.Column>
                )
            }
            </Grid>
        )
    }
}

export default Studies;
