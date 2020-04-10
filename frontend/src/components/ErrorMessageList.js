import React from 'react';
import PropTypes from 'prop-types';
import { Message } from 'semantic-ui-react'


const ErrorMessageList = (props) => {
    return (
        props.list ?
            <Message
                color='red'
                list={props.list}
            />
            : ""
    )
}

ErrorMessageList.propTypes = {
    list: PropTypes.array,
};

ErrorMessageList.defaultProps = {
    list: undefined,
};

export default ErrorMessageList;