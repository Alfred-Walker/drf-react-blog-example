import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react'


const ErrorMessage = (props) => {
    return (
        props.list ?
            <Message
                color='red'
                list={props.list}
            />
            : ""
    )
}

ErrorMessage.propTypes = {
    list: PropTypes.array,
};

ErrorMessage.defaultProps = {
    list: undefined,
};

export default ErrorMessage;