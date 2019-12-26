import React, { useState } from 'react';
import { Menu } from 'semantic-ui-react'
import { NavLink, Route, BrowserRouter as Router } from "react-router-dom";


/* Tutorial Reference*/
/* https://reactgo.com/semantic-ui-react/ */
function NavigationBar(props) {
    return (
        <Menu fixed='top' pointing>
            <Menu.Item as={NavLink} exact to="/" activeClassName="active" name='home'/>
            <Menu.Item as={NavLink} to="/study/new" activeClassName="active" name='new'/>
            <Menu.Item as={NavLink} to="/study/list" activeClassName="active" name='studies'/>
            <Menu.Item as={NavLink} exact to="/contact" activeClassName="active" name='contact'/>
        </Menu>
    )
}

export default NavigationBar;