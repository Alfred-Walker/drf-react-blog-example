import React from 'react';
import { Button, GridColumn, Divider, Label, Message } from 'semantic-ui-react'
import './internalServer.css';


const internalServer = (props) => {
    return (
        <GridColumn className='_error' >
            <div class='_code' > 500 </div> 
            <br />
            <Label className='_1' > INTERNAL SERVER ERROR </Label> 
            <Divider />
            <Message className='_2 negative' > 
                Sorry, the requested url was not found on this server. <br />
                If the problem persists, please contact to administrator.
             </Message> 
            <Button className='btn' onClick={props.history.goBack} > BACK </Button> 
        </GridColumn> 
    )
}

export default internalServer;
