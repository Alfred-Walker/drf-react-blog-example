import React, { Component } from 'react';
import { Link } from "react-router-dom";
import handleHttpResponseError from '../utils/httpResponseError';
import * as jwtUtil from '../utils/jwt';
import SearchInput from '../components/SearchInput';
import CommandButtonGroup from '../components/CommandButtonGroup';
import ReadOnlyQuillSegment from '../components/ReadOnlyQuillSegment'
import CommentThreaded from './comment/CommentThreaded'

import TagList from './tag/TagList';
import * as Urls from './Urls';

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
            tag: this.props.match.params.tag
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
        const jwt = jwtUtil.getJwt();
        const id = this.state.id;

        this.setState({ open: false });
        event.preventDefault();

        fetch(
            Urls.URL_STUDY_LIST + id + "/", {
            method: 'DELETE',
            headers: {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'application/json; charset="utf-8"'
            },
            credentials: 'include'
        }
        )
            .then(response => this.loadStudiesFromServer(1))
            .catch(err => console.log("delete error", err));
    }

    onPageChange(e, pageInfo) {
        this.setState({ activePage: pageInfo.activePage });
        this.loadStudiesFromServer(pageInfo.activePage, this.state.search, this.state.tag);
    }

    onShow(event) {
        const id = event.target.name;
        this.setState({ open: true, id: id })
    }

    onSubmit(event) {
        event.preventDefault();
        this.loadStudiesFromServer(1, this.state.search, this.state.tag);
    }

    onTagClick(event) {
        this.setState({ tag: event.target.name });
        this.loadStudiesFromServer(1, this.state.search, event.target.name);
    }

    loadStudiesFromServer(page, search, tag) {
        let headers = {};
        let studyListUrl = "";
        const jwt = jwtUtil.getJwt();

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
            .then(handleHttpResponseError)
            .then(response => response.json())
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
            .catch(error => this.props.history.push('/' + error.message));
    }

    loadRandomTagsFromServer(count) {
        let headers = {};
        let tagListUrl = "";
        const jwt = jwtUtil.getJwt();

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
            .then(handleHttpResponseError)
            .then(response => response.json())
            .then(
                result => {
                    this.setState({
                        tagList: result
                    });
                }
            )
            .catch(error => this.props.history.push('/' + error.message));
    }

    componentDidMount() {
        this.loadStudiesFromServer(this.props.page, undefined, this.props.match.params.tag);
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
                            onClick={this.onTagClick}
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

                                    {
                                        this.props.user && study.user && study.user.id === this.props.user.id ?
                                            <CommandButtonGroup
                                                id_parent={study.id}
                                                edit_page_path={"/study/edit/" + study.id}
                                                state={{ study: study }}
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

                                <CommentThreaded {...this.props} comments={study.comment} parent_study={study.id}></CommentThreaded>
                            </Grid.Column>
                        )
                    }
                    <GridColumn>
                        <Pagination
                            className='pagination'
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
                    <Menu.Item as={Link} to={{ pathname: '/study/new/' }}>
                        <Icon name='circle plus' />ADD STUDY
                    </Menu.Item>
                </Sidebar>
            </Segment>
        )
    }
}

export default Studies;
