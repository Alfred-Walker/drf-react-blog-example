import React from 'react'
import PropTypes from 'prop-types';
import { Grid, Header } from 'semantic-ui-react'
import { Link } from "react-router-dom";


function PopularTags(props) {
    return (
        props.tags.length > 1 ? 
        <Grid celled='internally' columns='equal' stackable>
            <Grid.Row textAlign='center'>
                {
                    props.tags.map(tag=>
                        <Grid.Column style={{ paddingBottom: '1em', paddingTop: '1em' }}>
                            <Header as={Link} to={props.tag_link_path + tag.name} style={{ fontSize: '1.5em' }}>
                                {tag.name}
                            </Header>
                        <p style={{ fontSize: '1.33em' }}>x{tag.total_count.toLocaleString()}</p>
                        </Grid.Column>
                    )
                }
            </Grid.Row>
        </Grid> : 
        <Header textAlign='center'>No tags registered yet...</Header>
    )
}

PopularTags.propTypes = {
    tags: PropTypes.array,
    tag_path: PropTypes.string
};

PopularTags.defaultProps = {
    tags: [],
    tag_link_path: "/tag/"
};

export default PopularTags;
