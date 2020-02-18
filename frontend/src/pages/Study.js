import React, { Component } from 'react';
import { Link } from "react-router-dom";
import * as Utils from '../utils/jwt';
import SearchInput from '../components/SearchInput';
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
    Segment,
    Sidebar
} from 'semantic-ui-react';

import './Study.css';


class Studies extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            studyList: undefined,
            tagList: undefined,
            activePage: this.props.page,
            pageCount: 1,
            perPageCount: 2,
            totalStudyCount: 0,
            search: "",
            tag: this.props.match.tag
        }

        this.handleGenericChange = this.handleGenericChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTagClick = this.handleTagClick.bind(this);
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
        this.loadStudiesFromServer(pageInfo.activePage, this.state.search, this.state.tag);
    }

    handleShow(event) {
        const id = event.target.name;
        this.setState({ open: true, id: id })
    }

    handleSubmit(event) {
        event.preventDefault();
        this.loadStudiesFromServer(1, this.state.search, this.state.tag);
    }

    handleTagClick(event) {
        this.setState({ tag: event.target.name });
        this.loadStudiesFromServer(1, this.state.search, event.target.name);
    }

    loadStudiesFromServer(page, search, tag) {
        let headers = {};
        let studyListUrl = "";
        const jwt = Utils.getJwt();

        if (jwt) {
            headers = {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'Application/json'
            };
        }

        if (tag) {
            if (search) {
                studyListUrl = this.props.studyListUrl + "?tag=" + tag + "&page=" + page + "&search=" + search;
            } else {
                studyListUrl = this.props.studyListUrl + "?tag=" + tag + "&page=" + page;
            }
        } else {
            if (search) {
                studyListUrl = this.props.studyListUrl + "?page=" + page + "&search=" + search;
            } else {
                studyListUrl = this.props.studyListUrl + "?page=" + page;
            }
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
        this.loadStudiesFromServer(this.props.page);
        this.loadRandomTagsFromServer(10);
    }

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
            <Segment fluid='true' className='study'>
                <Grid className='study' centered columns={1} doubling>
                    <Grid.Column>
                        <TagList
                            tags={this.state.tagList}
                            onClick={this.handleTagClick}
                        />
                    </Grid.Column>
                    {
                        this.state.studyList.map(study =>
                            <Grid.Column key={study.id}>
                                <Segment>
                                    <ReadOnlyQuillSegment 
                                        is_public={study.is_public}
                                        title={study.title}
                                        body={study.body}
                                        nickname={study.user.nickname}
                                        registered_date={study.registered_date}
                                        tags={study.tags}
                                    />

                                    <Button primary basic as="a" href="/">See all</Button>

                                    <Button
                                        as={Link}
                                        to={{ pathname: '/study/edit/' + study.id, state: { study: study } }}
                                        primary
                                        basic
                                    >
                                        Edit
                                    </Button>

                                    <Button
                                        name={study.id}
                                        onClick={this.handleShow}
                                        primary
                                        basic
                                        negative
                                    >
                                        Delete
                                    </Button>

                                    <Confirm
                                        open={this.state.open}
                                        content='Do you really want to delete?'
                                        onCancel={this.handleCancel}
                                        onConfirm={this.handleDelete}
                                    />
                                </Segment>

                                <CommentThreaded {...this.props} comments={study.comment} parent_study={study.id}></CommentThreaded>
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
                        <SearchInput
                            search={this.state.search}
                            onChange={this.handleGenericChange}
                            onSubmit={this.handleSubmit}
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
                    <Menu.Item as={Link} to={{ pathname: '/study/new/' }}>
                        <Icon name='circle plus' />ADD STUDY
                    </Menu.Item>
                </Sidebar>
            </Segment>
        )
    }
}

export default Studies;
