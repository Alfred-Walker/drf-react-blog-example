import React from 'react';
import { Button, Grid, Header, Label, List, Segment} from 'semantic-ui-react'
import { studies } from './dummy-studies';


function Studies(props) {
    return (
        <Grid centered columns={1} doubling> {
                    studies.map(study =>
                    <Grid.Column key={study.title}>
                        <Segment>
                            <Header as="h1">{study.title}</Header>
                            <p>{study.date}</p>
                            <p>{study.excerpt}</p>
                            <List className="list-tag-horizontal">
                                <Label tag>tag a</Label>
                                <Label tag>tag b</Label>
                                <Label tag>tag c</Label>
                                <Label tag>tag d</Label>
                            </List>
                            <Button primary basic as="a" href="/">See all</Button>
                            <Button primary basic as="a" href="/">Edit</Button>
                        </Segment>
                    </Grid.Column>
                    )
                }
        </Grid>
    )
}
export default Studies;
