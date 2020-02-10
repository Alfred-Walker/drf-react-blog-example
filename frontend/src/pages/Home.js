import React from 'react';
import { Button, Container, Divider, Grid, Header, Icon, Image, List, Segment, Transition } from 'semantic-ui-react'
import TagList from './tag/TagList';


function Home() {
    return (
        <Container>
            <Segment style={{ padding: '3em 0em 8em 0em', border: 'none' }} vertical>
                <Grid container stackable verticalAlign='middle'>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Header as='h3' style={{ fontSize: '2em' }}>
                                Last Study (LOGGINED_USER)
                        </Header>
                            <Divider />
                            <p style={{ fontSize: '1.33em' }}>
                                We can give your company superpowers to do things that they never thought possible.
                                Let us delight your customers and empower your needs... through pure data analytics.
                        </p>
                            <Button>More</Button>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Header as='h3' style={{ fontSize: '2em' }}>
                                Last Question (LOGGINED_USER)
                        </Header>
                            <Divider />
                            <p style={{ fontSize: '1.33em' }}>
                                We can give your company superpowers to do things that they never thought possible.
                                Let us delight your customers and empower your needs... through pure data analytics.
                        </p>
                            <Button>More</Button>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={8}>
                            <Header as='h3' style={{ fontSize: '2em' }}>
                                Latest Study by author
                        </Header>
                            <Divider />
                            <p style={{ fontSize: '1.33em' }}>
                                We can give your company superpowers to do things that they never thought possible.
                                Let us delight your customers and empower your needs... through pure data analytics.
                        </p>
                            <Button>More</Button>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <Header as='h3' style={{ fontSize: '2em' }}>
                                Latest Question by author
                        </Header>
                            <Divider />
                            <p style={{ fontSize: '1.33em' }}>
                                We can give your company superpowers to do things that they never thought possible.
                                Let us delight your customers and empower your needs... through pure data analytics.
                        </p>
                            <Button>More</Button>
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
            <Segment style={{ padding: '0em 0em 4em 0em', border: 'none' }} vertical>
                <Segment style={{ padding: '0em' }} vertical>
                    <Grid celled='internally' columns='equal' stackable>
                        <Grid.Row textAlign='center'>
                            <Grid.Column style={{ paddingBottom: '1em', paddingTop: '1em' }}>
                                <Header as='h3' style={{ fontSize: '1.5em' }}>
                                    django
                            </Header>
                                <p style={{ fontSize: '1.33em' }}>x123,456</p>
                            </Grid.Column>
                            <Grid.Column style={{ paddingBottom: '1em', paddingTop: '1em' }}>
                                <Header as='h3' style={{ fontSize: '1.5em' }}>
                                    react
                            </Header>
                                <p style={{ fontSize: '1.33em' }}>x123</p>
                            </Grid.Column>
                            <Grid.Column style={{ paddingBottom: '1em', paddingTop: '1em' }}>
                                <Header as='h3' style={{ fontSize: '1.5em' }}>
                                    semantic-ui
                            </Header>
                                <p style={{ fontSize: '1.33em' }}>x123</p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
                <Segment style={{ padding: '0em 0em 0em 0em' }} vertical>
                    <Grid celled='internally' columns='equal' stackable>
                        <Grid.Row textAlign='center'>
                            <Grid.Column style={{ paddingBottom: '1em', paddingTop: '1em' }}>
                                <Header as='h3' style={{ fontSize: '1.5em' }}>
                                    python
                            </Header>
                                <p style={{ fontSize: '1.33em' }}>x123</p>
                            </Grid.Column>
                            <Grid.Column style={{ paddingBottom: '1em', paddingTop: '1em' }}>
                                <Header as='h3' style={{ fontSize: '1.5em' }}>
                                    javascript
                            </Header>
                                <p style={{ fontSize: '1.33em' }}>x123</p>
                            </Grid.Column>
                            <Grid.Column style={{ paddingBottom: '1em', paddingTop: '1em' }}>
                                <Header as='h3' style={{ fontSize: '1.5em' }}>
                                    http
                            </Header>
                                <p style={{ fontSize: '1.33em' }}>x123</p>
                            </Grid.Column>
                            <Grid.Column style={{ paddingBottom: '1em', paddingTop: '1em' }}>
                                <Header as='h3' style={{ fontSize: '1.5em' }}>
                                    mysql
                            </Header>
                                <p style={{ fontSize: '1.33em' }}>x123</p>
                            </Grid.Column>
                            <Grid.Column style={{ paddingBottom: '1em', paddingTop: '1em' }}>
                                <Header as='h3' style={{ fontSize: '1.5em' }}>
                                    git
                            </Header>
                                <p style={{ fontSize: '1.33em' }}>x123</p>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Segment>
            </Segment>

            <Segment textAlign='center'>
                <List horizontal>
                    <List.Item><Icon name='user' /> User: 123,456</List.Item>
                    <List.Item><Icon name='book' /> Study: 123,456</List.Item>
                    <List.Item><Icon name='question' /> Question: 123,456</List.Item>
                    <List.Item><Icon name='comment' /> Comment: 123,456</List.Item>
                </List>
            </Segment>
        </Container>
    )
}
export default Home;
