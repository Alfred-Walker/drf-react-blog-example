import React, { useEffect, useState } from 'react'
import {
    Container,
    Divider,
    Grid,
    Segment
} from 'semantic-ui-react'

import LastStudy from './home/LastStudy'
import LastQuestion from './home/LastQuestion'
import LatestStudy from './home/LatestStudy'
import LatestQuestion from './home/LatestQuestion'
import PopularTags from './home/PopularTags';
import CountInfo from './home/CountInfo';

import * as Utils from '../utils/jwt';


function Home(props) {
    const [lastStudy, setLastStudy] = useState(undefined);
    const [lastQuestion, setLastQuestion] = useState(undefined);
    const [latestStudy, setLatestStudy] = useState(undefined);
    const [latestQuestion, setLatestQuestion] = useState(undefined);
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

    const onLastStudyLoadSuccess = (result) => {
        setLastStudy(result);
        // console.log("onLastStudyLoadSuccess");
    }

    const onLastStudyLoadFailure = () => {
        // console.log("onLastStudyLoadFailure");
    }

    const onLastQuestionLoadSuccess = (result) => {
        setLastQuestion(result);
        // console.log("onLastQuestionLoadSuccess", result);
    }

    const onLastQuestionLoadFailure = () => {
        // console.log("onLastQuestionLoadFailure");
    }

    const onLatestStudyLoadSuccess = (result) => {
        setLatestStudy(result);
        // console.log("onLastStudyLoadSuccess");
    }

    const onLatestStudyLoadFailure = () => {
        // console.log("onLastStudyLoadFailure");
    }

    const onLatestQuestionLoadSuccess = (result) => {
        setLatestQuestion(result);
        // console.log("onLastQuestionLoadSuccess");
    }

    const onLatestQuestionLoadFailure = () => {
        // console.log("onLastQuestionLoadFailure");
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
            if (loggedInStatus === 'LOGGED_IN') {
                loadDataFromServer("http://localhost:8000/study/last/", onLastStudyLoadSuccess, onLastStudyLoadFailure);
                loadDataFromServer("http://localhost:8000/question/last/", onLastQuestionLoadSuccess, onLastQuestionLoadFailure);
            }

            loadDataFromServer("http://localhost:8000/study/latest/", onLatestStudyLoadSuccess, onLatestStudyLoadFailure);
            loadDataFromServer("http://localhost:8000/question/latest/", onLatestQuestionLoadSuccess, onLatestQuestionLoadFailure);
            loadDataFromServer("http://localhost:8000/tag/popular/", onPopularTagsLoadSuccess, onPopularTagsLoadFailure);
            loadDataFromServer("http://localhost:8000/indicator/count/", onCountInfoLoadSuccess, onCountInfoLoadFailure);
        }

        fetchData(props.loggedInStatus);
    }, [props.loggedInStatus]);

    return (
        <Container>
            <Segment style={{ padding: '3em 0em 8em 0em', border: 'none' }} vertical>
                <Grid container stackable verticalAlign='top'>
                    {
                        props.loggedInStatus === 'LOGGED_IN' ?
                            <Grid.Row>
                                <Grid.Column width={8}>
                                    <LastStudy
                                        study={lastStudy}
                                        study_link_path='/study/'
                                    />
                                </Grid.Column>
                                <Grid.Column width={8}>
                                    <LastQuestion
                                        question={lastQuestion}
                                        question_link_path='/question/'
                                    />
                                </Grid.Column>
                            </Grid.Row> : ""
                    }
                    <Grid.Row></Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <LatestStudy
                                study={latestStudy}
                                study_link_path='/study/'
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <LatestQuestion
                                question={latestQuestion}
                                question_link_path='/question/'
                            />
                        </Grid.Column>
                    </Grid.Row>
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
export default Home;
