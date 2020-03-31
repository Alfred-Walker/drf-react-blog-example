import React from 'react';
import PropTypes from 'prop-types';
import './Unauthorized.css';
import {
    Button,
    Divider,
    GridColumn,
    Header,
    Label,
    Message
} from 'semantic-ui-react'


const Unauthorized = (props) => {
    return (
        <GridColumn className='unauthorized' >
            <Header size='huge' className='header' > 401 </Header>
            <Label className='label' > UNAUTHORIZED ACCESS </Label>
            <Divider />
            <Message className='message negative' > You have attempted to access a page for which you ar not authorized. </Message>
            <Button className='button' onClick={props.history.goBack} primary basic> BACK </Button>
        </GridColumn>
    )
}

Unauthorized.propTypes = {
    history: PropTypes.object
};

Unauthorized.defaultProps = {
    history: undefined
};

export default Unauthorized;