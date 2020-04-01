import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Unauthorized from './error/Unauthorized';
import Forbidden from './error/Forbidden';
import NotFound from './error/NotFound';
import InternalServer from './error/InternalServer';


class Error extends Component {
    render() {
        const errorCode = this.props.errorCode;

        if (errorCode === '401') return <Unauthorized {...this.props} />;
        if (errorCode === '403') return <Forbidden {...this.props} />;
        if (errorCode === '404') return <NotFound {...this.props} />;
        if (errorCode === '500') return <InternalServer {...this.props} />;
        
        return <InternalServer {...this.props} />;
    }
}

Error.propTypes = {
    errorCode: PropTypes.string
};

Error.defaultProps = {
    errorCode: '500'
};

export default Error;