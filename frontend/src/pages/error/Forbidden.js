import React from 'react';
import PropTypes from 'prop-types';
import './Forbidden.css';
import {
    Button,
    Divider,
    GridColumn,
    Header,
    Label,
    Message
} from 'semantic-ui-react'


const Forbidden = (props) => {
    return (
        <GridColumn className='forbidden' >
            <Header size='huge' className='header' > 403 </Header>
            <Label className='label' > FORBIDDEN </Label>
            <Divider />
            <Message className='message negative' > You don't have permission to access this page. </Message>
            <Button className='button' onClick={props.history.goBack} primary basic> BACK </Button>
        </GridColumn>
    )
}

Forbidden.propTypes = {
    history: PropTypes.object
};

Forbidden.defaultProps = {
    history: undefined
};

export default Forbidden;