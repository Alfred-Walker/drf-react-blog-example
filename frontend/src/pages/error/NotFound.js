import React from 'react';
import PropTypes from 'prop-types';
import './NotFound.css';
import {
    Button,
    Divider,
    GridColumn,
    Header,
    Label,
    Message
} from 'semantic-ui-react'


const NotFound = (props) => {
    return (
        <GridColumn className='not-found' >
            <Header size='huge' className='header' > 404 </Header>
            <Label className='label' > PAGE NOT FOUND </Label>
            <Divider />
            <Message className='message negative' > Sorry, the requested url was not found on this server. </Message>
            <Button className='button' onClick={props.history.goBack} primary basic> BACK </Button>
        </GridColumn>
    )
}

NotFound.propTypes = {
    history: PropTypes.object
};

NotFound.defaultProps = {
    history: undefined
};

export default NotFound;