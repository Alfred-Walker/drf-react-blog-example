import React, { Component } from 'react';
import { getJwt } from '../utils/jwt';
import { Link } from "react-router-dom";
import ReactQuill from 'react-quill';
import TagsInput from 'react-tagsinput';
import * as Utils from '../utils/jwt';

import TagList from './tag/TagList';

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

import './Question.css';


class Questions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            questionList: undefined,
            tagList: undefined,
            activePage: this.props.page,
            pageCount: 1,
            perPageCount: 2,
            totalQuestionCount: 0,
            tag: this.props.match.tag
        }

        this.tagsInputProps = {
            className: 'react-tagsinput-input',
            placeholder: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleTagClick = this.handleTagClick.bind(this);
    }

    handleCancel = () => this.setState({ open: false })

    handleChange(tags) {
        this.setState({ tags });
    }

    handleDelete(event) {
        const jwt = Utils.getJwt();
        const id = this.state.id;

        this.setState({ open: false });
        event.preventDefault();

        fetch(
            'http://localhost:8000/question/' + id + "/", {
            method: 'DELETE',
            headers: {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'application/json; charset="utf-8"'
            },
            credentials: 'include'
        }
        )
            .then(
                response => this.loadQuestionsFromServer(1)
            )
            .catch(
                err => console.log("delete error", err)
            );
    }

    handlePageChange(e, pageInfo) {
        this.setState({ activePage: pageInfo.activePage });
        this.loadQuestionsFromServer(pageInfo.activePage, this.state.tag);
    }

    handleShow(event) {
        const id = event.target.name;
        this.setState({ open: true, id: id })
    }

    handleTagClick(event) {
        this.setState({ tag: event.target.name });
        this.loadQuestionsFromServer(1, event.target.name);
    }

    loadQuestionsFromServer(page, tag) {
        let headers = {};
        let questionListUrl = "";
        const jwt = getJwt();

        if (jwt) {
            headers = {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'Application/json'
            };
        }

        if (tag) {
            questionListUrl = this.props.questionListUrl + "?tag=" + tag + "&page=" + page;
        } else {
            questionListUrl = this.props.questionListUrl + "?page=" + page;
        }

        fetch(
            questionListUrl, {
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
                        questionList: result.results,
                        pageCount: Math.ceil(result.count / this.state.perPageCount),
                        totalQuestionCount: result.count,
                        prevPage: result.previous,
                        nextPage: result.next
                    });
                }
            )
            .catch(
                // TODO: need better catch.
                err => {
                    console.log("questions error", err);
                    this.props.history.push('/');
                }
            );
    }

    loadRandomTagsFromServer(count) {
        let headers = {};
        let tagListUrl = "";
        const jwt = Utils.getJwt();

        if (jwt) {
            headers = {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'Application/json'
            };
        }

        tagListUrl = this.props.tagListUrl + "random/?count=" + count;

        fetch(
            tagListUrl, {
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
                        tagList: result
                    });
                    console.log(result);
                }
            )
            .catch(
                err => {
                    console.log("tags error", err);
                }
            );
    }

    componentDidMount() {
        this.loadQuestionsFromServer(this.props.page);
        this.loadRandomTagsFromServer(10)
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
        if (this.state.questionList === undefined) {
            return (
                <Dimmer active>
                    <Loader>Loading</Loader>
                </Dimmer>
            );
        }

        if (this.state.questionList.length === 0) {
            return (
                <GridColumn className='question-empty' >
                    <Header className='header'>&nbsp;NO DATA</Header>
                    <Label className='label'>&nbsp;STUDY NOT FOUND</Label>
                    <Divider />
                    <Message className='message'>
                        There is no question accessible. <br />
                    </Message>
                    <Button as={Link} to={{ pathname: '/question/new/' }} primary basic>ADD YOUR STUDY</Button>
                </GridColumn>
            );
        }

        return (
            <Grid centered columns={1} doubling>
                <Grid.Column>
                    <TagList
                        tags={this.state.tagList}
                        onClick={this.handleTagClick}
                    />
                </Grid.Column>
                {
                    this.state.questionList.map(question =>
                        <Grid.Column key={question.id}>
                            <Segment>
                                <Header as="h1">
                                    {question.title}
                                </Header>
                                <Divider />
                                <ReactQuill
                                    modules={this.modules}
                                    formats={this.formats}
                                    value={question.body}
                                    readOnly={true}
                                    theme={"snow"}
                                />
                                <p>
                                    {question.registered_date}
                                </p>
                                <p>{question.excerpt}</p>
                                <List className="list-tag-horizontal">
                                    <TagsInput in
                                        disabled={true}
                                        value={question.tags}
                                        inputProps={this.tagsInputProps}
                                    />
                                </List>
                                <Button primary basic as="a" href="/">See all</Button>
                                <Button as={Link} to={{ pathname: '/question/edit/' + question.id, state: { question: question } }} primary basic>Edit</Button>
                                <Button name={question.id} onClick={this.handleShow} primary basic negative>Delete</Button>
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
                <Pagination
                    activePage={this.state.activePage}
                    onPageChange={this.handlePageChange}
                    totalPages={this.state.pageCount}
                    ellipsisItem={null}
                />
            </Grid>
        )
    }
}

export default Questions;
