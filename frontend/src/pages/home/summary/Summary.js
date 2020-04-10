import React from 'react'
import PropTypes from 'prop-types';
import { Divider, Header, Icon } from 'semantic-ui-react'
import { Link } from "react-router-dom";
import './Summary.css'


function Summary(props) {
    return (
        <div>
            <Header as={Link} to={{ pathname: props.link_path }} style={{ fontSize: '2em' }}>
                {props.title}
            </Header>
            <Divider />
            <p className="excerpt">
                {
                    props.body.replace(/(<([^>]+)>)/ig, "")
                }
            </p>
            {
                props.author && props.created_date ?
                    <p><Icon name='user' />{props.author} &nbsp;&nbsp;/&nbsp;&nbsp; {props.created_date}</p> 
                    : <p> &nbsp; </p>
            }
        </div>
    )
}

Summary.propTypes = {
    id: PropTypes.number,
    title: PropTypes.string,
    body: PropTypes.string,
    author: PropTypes.string,
    created_date: PropTypes.string,
    link_path: PropTypes.string
};

Summary.defaultProps = {
    id: undefined,
    title: "No study found...",
    body: "There is no study accessible...",
    author: "",
    created_date: "",
    link_path: "/"
};

export default Summary;
