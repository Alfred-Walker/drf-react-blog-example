import React from 'react';
import PropTypes from 'prop-types';
import './InternalServer.css';
import {
    Button,
    Divider,
    GridColumn,
    Header,
    Label,
    Message
} from 'semantic-ui-react'


const InternalServer = (props) => {
    return (
        <GridColumn className='internal-server' >
            <Header size='huge' className='header' > 500 </Header>
            <Label className='label' > INTERNAL SERVER ERROR </Label>
            <Divider />
            <Message className='message negative' >
                Sorry, the requested url was not found on this server. <br />
                If the problem persists, please contact to administrator.
             </Message>
            <Button className='button' onClick={props.history.goBack} primary basic> BACK </Button>
        </GridColumn>
    )
}

InternalServer.propTypes = {
    history: PropTypes.object
};

InternalServer.defaultProps = {
    history: undefined
};

export default InternalServer;
