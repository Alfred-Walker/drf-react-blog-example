import React, { useEffect, useState } from 'react'
import {
    Container,
    Divider,
    Grid,
    Segment
} from 'semantic-ui-react'
import PropTypes from 'prop-types';
import PopularTags from './home/PopularTags';
import CountInfo from './home/CountInfo';
import TitleList from '../components/TitleList'

import * as Utils from '../utils/jwt';


function Home(props) {
    const [popularTags, setPopularTags] = useState(undefined);
    const [countInfo, setCountInfo] = useState(undefined);


    const loadDataFromServer = (url, callbackOnSuccess, callbackOnError) => {
        let headers = {};
        const jwt = Utils.getJwt();

        if (jwt) {
            headers = {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'Application/json'
            };
        }

        fetch(
            url, {
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
                    callbackOnSuccess(result);
                }
            )
            .catch(
                // TODO: need better catch.
                err => {
                    callbackOnError();
                }
            );
    }

    const onPopularTagsLoadSuccess = (result) => {
        setPopularTags(result);
    }

    const onPopularTagsLoadFailure = () => {
        // console.log("onPopularTagsLoadFailure");
    }

    const onCountInfoLoadSuccess = (result) => {
        setCountInfo(result);
    }

    const onCountInfoLoadFailure = () => {
        // console.log("onCountInfoLoadFailure");
    }

    // similar to componentDidMount & componentDidUpdate of class components
    useEffect(() => {
        function fetchData(loggedInStatus) {
            // TODO: Need to pass url from 'App.js' to 'Home.js' via props
            // TODO: All urls must be managed at one place together
            loadDataFromServer("http://localhost:8000/tag/popular/", onPopularTagsLoadSuccess, onPopularTagsLoadFailure);
            loadDataFromServer("http://localhost:8000/indicator/count/", onCountInfoLoadSuccess, onCountInfoLoadFailure);
        }

        fetchData(props.loggedInStatus);
    }, [props.loggedInStatus]);

    return (
        <Container>
            <Segment style={{ padding: '3em 0em 8em 0em', border: 'none' }} vertical>
                <Grid columns={2} container stackable verticalAlign='top'>
                    <Grid.Row>
                        <Grid.Column>
                            <TitleList
                                {...props}
                                url="http://localhost:8000/study/recent"
                                itemPath="/study/"
                                perPageCount={10}
                                header="Recent Studies"
                                showPagination={false}
                            />
                        </Grid.Column>
                        <br />
                        <br />
                        <Grid.Column>
                            <TitleList
                                {...props}
                                url="http://localhost:8000/question/recent"
                                itemPath="/question/"
                                perPageCount={10}
                                header="Recent Questions"
                                showPagination={false}
                                icon="question"
                            />
                        </Grid.Column>
                    </Grid.Row>
                    {
                        props.loggedInStatus === 'LOGGED_IN' ?
                            <Grid.Row>
                                <Grid.Column>
                                    <TitleList
                                        {...props}
                                        url="http://localhost:8000/study/my"
                                        itemPath="/study/"
                                        perPageCount={10}
                                        header="My Studies"
                                        showPagination={false}
                                    />
                                </Grid.Column>
                                <br />
                                <br />
                                <Grid.Column>
                                    <TitleList
                                        {...props}
                                        url="http://localhost:8000/question/my"
                                        itemPath="/question/"
                                        perPageCount={10}
                                        header="My Questions"
                                        showPagination={false}
                                        icon="question"
                                    />
                                </Grid.Column>
                            </Grid.Row> : ""
                    }
                </Grid>

            </Segment>
            <Divider
                as='h4'
                className='header'
                horizontal
                style={{ margin: '0em 0em', textTransform: 'uppercase' }}
            >
                <a href='/#'>Popular Tags</a>
            </Divider>
            <Segment style={{ padding: '2em 0em 2em 0em', border: 'none' }} vertical>
                <Segment style={{ padding: '0em' }} vertical>
                    <PopularTags
                        tags={popularTags}
                        tag_link_path="/tag/"
                    />
                </Segment>
            </Segment>

            {
                countInfo ?
                    <Segment textAlign='center'>
                        <CountInfo
                            user_count={countInfo.all_user_count}
                            study_count={countInfo.all_study_count}
                            question_count={countInfo.all_question_count}
                            comment_count={countInfo.all_comment_count}
                            tag_count={countInfo.all_tag_count}
                        />
                    </Segment>
                    : ""
            }
        </Container>
    )
}

Home.propTypes = {
    history: PropTypes.object,
    loggedInStatus: PropTypes.string,
    user: PropTypes.object,
};

Home.defaultProps = {
    history: undefined,
    loggedInStatus: "NOT_LOGGED_IN",
    user: undefined,
};

export default Home;
