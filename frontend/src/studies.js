import React from 'react';
import { Segment, Header, Grid, Image,Button } from 'semantic-ui-react'
import { studies } from './dummy-studies';

function Studies() {
    return (
        <div className="container">
            <Grid centered columns={1} doubling> {
                    studies.map(study =>
                    <Grid.Column key={study.title}>
                        <Segment>
                            <Header as="h1">{study.title}</Header>
                            <p>{study.date}</p>
                            <p>{study.excerpt}</p>
                            <Button primary basic as="a" href="/">
                            See all</Button>
                        </Segment>
                    </Grid.Column>
                    )
                }
            </Grid>
        </div>
    )
}
export default Studies;
