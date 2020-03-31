import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react'


const ErrorMessage = (props) => {
    return (
        <Message negative>
            <Message.Header>{props.header}</Message.Header>
            <p>{props.contents}</p>
        </Message>
    )
}

ErrorMessage.propTypes = {
    header: PropTypes.string,
    contents: PropTypes.string,
};

ErrorMessage.defaultProps = {
    header: "",
    contents: "",
};

export default ErrorMessage;