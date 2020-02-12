import React from 'react';
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


function Home(props) {
    const dummy_study = {
        id: 1,
        title: "dummy_study_title",
        body: "dummy_study_body",
        created_date: "2020-02-02"
    }

    const dummy_question = {
        id: 1,
        title: "dummy_question_title",
        body: "dummy_question_body",
        created_date: "2020-02-02"
    }

    const dummy_popular_tags = [
        { name: "django", count: 123456 },
        { name: "react", count: 123 },
        { name: "semantic-ui", count: 12345 },
        { name: "python", count: 123456 },
        { name: "javascript", count: 12345 },
    ]

    const dummy_user_count = 123456;
    const dummy_study_count = 123456;
    const dummy_question_count = 123456;
    const dummy_comment_count = 123456;
    const dummy_tag_count = 123456;

    return (
        <Container>
            <Segment style={{ padding: '3em 0em 8em 0em', border: 'none' }} vertical>
                <Grid container stackable verticalAlign='middle'>
                    {
                        props.loggedInStatus === 'LOGGED_IN' ?
                        <Grid.Row>
                        <Grid.Column width={8}>
                            <LastStudy 
                                study={dummy_study} 
                                study_link_path='/study/'
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <LastQuestion
                                question={dummy_question} 
                                question_link_path='/question/'
                            />
                        </Grid.Column>
                    </Grid.Row> : ""       
                    }
                    <Grid.Row></Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <LatestStudy 
                                study={dummy_study} 
                                study_link_path='/study/'
                            />
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <LatestQuestion 
                                question={dummy_question} 
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
                <a href='#'>Popular Tags</a>
            </Divider>
            <Segment style={{ padding: '2em 0em 2em 0em', border: 'none' }} vertical>
                <Segment style={{ padding: '0em' }} vertical>
                    <PopularTags 
                        tags={dummy_popular_tags} 
                        tag_link_path="/tag/"
                    />
                </Segment>
            </Segment>

            <Segment textAlign='center'>
                <CountInfo
                    user_count={dummy_user_count}
                    study_count={dummy_study_count}
                    question_count={dummy_question_count}
                    comment_count={dummy_comment_count}
                    tag_count={dummy_tag_count}
                />
            </Segment>
        </Container>
    )
}
export default Home;
