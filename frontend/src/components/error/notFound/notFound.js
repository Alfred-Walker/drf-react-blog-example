import React from 'react';
import { Button, GridColumn, Divider, Label, Message } from 'semantic-ui-react'
import './notFound.css';


const notFound = (props) => {
    return (
        <GridColumn className='_error' >
            <div class='_code' > 404 </div> 
            <br />
            <Label className='_1' > PAGE NOT FOUND </Label> 
            <Divider />
            <Message className='_2 negative' > Sorry, the requested url was not found on this server. </Message> 
            <Button className='btn' onClick={props.history.goBack} > BACK </Button> 
        </GridColumn> 
    )
}
                        
export default notFound;