import React, { Component } from 'react';
import { getJwt } from '../utils/jwt';
import { Link } from "react-router-dom";
import * as Utils from '../utils/jwt';
import SearchInput from '../components/SearchInput';
import CommandButtonGroup from '../components/CommandButtonGroup';
import ReadOnlyQuillSegment from '../components/ReadOnlyQuillSegment'
import CommentThreaded from './comment/CommentThreaded'

import TagList from './tag/TagList';

import {
    Button,
    Confirm,
    Dimmer,
    Divider,
    Grid,
    GridColumn,
    Header,
    Icon,
    Label,
    Loader,
    Menu,
    Message,
    Pagination,
    Sidebar,
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
            search: "",
            tag: this.props.match.tag
        }

        this.tagsInputProps = {
            className: 'react-tagsinput-input',
            placeholder: ''
        }

        this.onGenericChange = this.onGenericChange.bind(this);
        this.onDelete = this.onDelete.bind(this);
        this.onPageChange = this.onPageChange.bind(this);
        this.onShow = this.onShow.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onTagClick = this.onTagClick.bind(this);
    }

    onCancel = () => this.setState({ open: false })

    onGenericChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    onDelete(event) {
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
            .then(response => this.loadQuestionsFromServer(1))
            .catch(err => console.log("delete error", err));
    }

    onPageChange(e, pageInfo) {
        this.setState({ activePage: pageInfo.activePage });
        this.loadQuestionsFromServer(pageInfo.activePage, this.state.search, this.state.tag);
    }

    onShow(event) {
        const id = event.target.name;
        this.setState({ open: true, id: id })
    }

    onSubmit(event) {
        event.preventDefault();
        this.loadQuestionsFromServer(1, this.state.search, this.state.tag);
    }

    onTagClick(event) {
        this.setState({ tag: event.target.name });
        this.loadQuestionsFromServer(1, this.state.search, event.target.name);
    }

    loadQuestionsFromServer(page, search, tag) {
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
            if (search) {
                questionListUrl = this.props.questionListUrl + "?tag=" + tag + "&page=" + page + "&search=" + search;
            } else {
                questionListUrl = this.props.questionListUrl + "?tag=" + tag + "&page=" + page;
            }
        } else {
            if (search) {
                questionListUrl = this.props.questionListUrl + "?page=" + page + "&search=" + search;
            } else {
                questionListUrl = this.props.questionListUrl + "?page=" + page;
            }
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
                    <Label className='label'>&nbsp;QUESTION NOT FOUND</Label>
                    <Divider />
                    <Message className='message'>
                        There is no question accessible. <br />
                    </Message>
                    <Button as={Link} to={{ pathname: '/question/new/' }} primary basic>ADD YOUR QUESTION</Button>
                </GridColumn>
            );
        }

        return (
            <Segment fluid='true' className='question'>
                <Grid centered columns={1} doubling>
                    <Grid.Column>
                        <TagList
                            tags={this.state.tagList}
                            onClick={this.onTagClick}
                        />
                    </Grid.Column>
                    {
                        this.state.questionList.map(question =>
                            <Grid.Column key={question.id}>
                                <Segment>
                                    <ReadOnlyQuillSegment
                                        is_public={true}
                                        title={question.title}
                                        body={question.body}
                                        nickname={question.user.nickname}
                                        registered_date={question.registered_date}
                                        tags={question.tags}
                                    />

                                    {
                                        this.props.user && question.user && question.user.id === this.props.user.id ?
                                            <CommandButtonGroup
                                                id_parent={question.id}
                                                edit_page_path={"/question/edit/" + question.id}
                                                state={{ question: question }}
                                                onDeleteClick={this.onShow}
                                            />
                                            : ""
                                    }

                                    <Confirm
                                        open={this.state.open}
                                        content='Do you really want to delete?'
                                        onCancel={this.onCancel}
                                        onConfirm={this.onDelete}
                                    />
                                </Segment>

                                <CommentThreaded {...this.props} comments={question.comment} parent_question={question.id}></CommentThreaded>
                            </Grid.Column>
                        )
                    }
                    <GridColumn>
                        <Pagination
                            activePage={this.state.activePage}
                            onPageChange={this.onPageChange}
                            totalPages={this.state.pageCount}
                            ellipsisItem={null}
                        />
                    </GridColumn>

                    <GridColumn>
                        <SearchInput
                            search={this.state.search}
                            onChange={this.onGenericChange}
                            onSubmit={this.onSubmit}
                        />
                    </GridColumn>
                </Grid>
                <Sidebar
                    as={Menu}
                    animation='overlay'
                    direction='bottom'
                    icon='labeled'
                    inverted
                    vertical
                    visible
                    width='very thin'
                >
                    <Menu.Item as={Link} to={{ pathname: '/question/new/' }}>
                        <Icon name='circle plus' />ADD QUESTION
                    </Menu.Item>
                </Sidebar>
            </Segment>
        )
    }
}

export default Questions;
