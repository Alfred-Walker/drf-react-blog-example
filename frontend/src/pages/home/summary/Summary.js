import React from 'react'
import PropTypes from 'prop-types';
import { Button, Divider, Header } from 'semantic-ui-react'
import { Link } from "react-router-dom";


function Summary(props) {
    return (
        <div>
            <Header as='h3' style={{ fontSize: '2em' }}>
                {props.title}
            </Header>
            <Divider />
            <p style={{ fontSize: '1.33em' }}>
                {props.body}
            </p>
            <Button as={Link} to={{ pathname: props.link_path }} primary basic>See Detail</Button>
        </div>
    )
}

Summary.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    body: PropTypes.string,
    created_date: PropTypes.string,
    link_path: PropTypes.string
};

Summary.defaultProps = {
    id: undefined,
    title: "title undefined",
    body: "contents undefined",
    created_date: "default_date",
    link_path: "/"
};

export default Summary;
