import React, { Component } from 'react';
import PropTypes from 'prop-types';
import NotFound from './error/NotFound';
import InternalServer from './error/InternalServer';


class Error extends Component {
    render() {
        const errorCode = this.props.errorCode;

        if (errorCode === 404) {
            return <NotFound {...this.props} />;
        } else {
            return <InternalServer {...this.props} />;
        }
    }
}

Error.propTypes = {
    errorCode: PropTypes.number
};

Error.defaultProps = {
    errorCode: 500
};

export default Error;