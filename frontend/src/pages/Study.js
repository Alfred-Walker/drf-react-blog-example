import React, { Component } from 'react';
import { Link } from "react-router-dom";
import ReactQuill from 'react-quill';
import TagsInput from 'react-tagsinput';
import * as Utils from '../utils/jwt';

import SearchInput from '../components/SearchInput';

import {
    Button,
    Confirm,
    Dimmer,
    Divider,
    Grid,
    GridColumn,
    Header,
    Label,
    List,
    Loader,
    Message,
    Pagination,
    Segment
} from 'semantic-ui-react';

import './Study.css';


class Studies extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            studyList: undefined,
            activePage: this.props.page,
            pageCount: 1,
            perPageCount: 2,
            totalStudyCount: 0,
            search: ""
        }

        this.tagsInputProps = {
            className: 'react-tagsinput-input',
            placeholder: ''
        }

        this.handleGenericChange = this.handleGenericChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleCancel = () => this.setState({ open: false })

    handleGenericChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleDelete(event) {
        const jwt = Utils.getJwt();
        const id = this.state.id;

        this.setState({ open: false });
        event.preventDefault();

        fetch(
            'http://localhost:8000/study/' + id + "/", {
            method: 'DELETE',
            headers: {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'application/json; charset="utf-8"'
            },
            credentials: 'include'
        }
        )
            .then(
                response => this.loadStudiesFromServer(1)
            )
            .catch(
                err => console.log("delete error", err)
            );
    }

    handlePageChange(e, pageInfo) {
        this.setState({ activePage: pageInfo.activePage });
        this.loadStudiesFromServer(pageInfo.activePage, this.state.search);
    }

    handleShow(event) {
        const id = event.target.name;
        this.setState({ open: true, id: id })
    }

    handleSubmit(event) {
        event.preventDefault();
        this.loadStudiesFromServer(1, this.state.search);
    }

    loadStudiesFromServer(page, search) {
        let headers = {};
        let studyListUrl = "";
        const jwt = Utils.getJwt();

        if (jwt) {
            headers = {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'Application/json'
            };
        }

        if (search) {
            studyListUrl = this.props.studyListUrl + "?page=" + page + "&search=" + search;
        } else {
            studyListUrl = this.props.studyListUrl + "?page=" + page;
        }

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
                        studyList: result.results,
                        pageCount: Math.ceil(result.count / this.state.perPageCount),
                        totalStudyCount: result.count,
                        prevPage: result.previous,
                        nextPage: result.next
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

    componentDidMount() {
        this.loadStudiesFromServer(this.props.page);
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
                    </Message>
                    <Button as={Link} to={{ pathname: '/study/new/' }} primary basic>ADD YOUR STUDY</Button>
                </GridColumn>
            );
        }

        return (
            <Grid className='study' centered columns={1} doubling> {
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
                            <Button as={Link} to={{ pathname: '/study/edit/' + study.id, state: { study: study } }} primary basic>Edit</Button>
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
                <GridColumn>
                    <Pagination
                        className='pagination'
                        activePage={this.state.activePage}
                        onPageChange={this.handlePageChange}
                        totalPages={this.state.pageCount}
                        ellipsisItem={null}
                    />
                </GridColumn>

                <GridColumn>
                    <SearchInput search={this.state.search} onChange={this.handleGenericChange} onSubmit={this.handleSubmit} />
                </GridColumn>
            </Grid>

        )
    }
}

export default Studies;
