import React from 'react';
import { Menu } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import { NavLink } from "react-router-dom";
import './Navigation.css';

/* Tutorial Reference*/
/* https://reactgo.com/semantic-ui-react/ */
function NavigationBar(props) {
    return (
        <Menu fixed='top' pointing>
            <Menu.Item as={NavLink} exact to="/" activeClassName="active" name="home"/>
            {props.loggedInStatus === "LOGGED_IN" ? <Menu.Item as={NavLink} to="/study/new" activeClassName="active" name="new"/> : <span></span>}
            <Menu.Item as={NavLink} exact to="/study" activeClassName="active" name="studies"/>
            <Menu.Item as={NavLink} to="/question" activeClassName="active" name="Questions"/>
            <Menu.Item className="nav-right" name={props.user}/>
            {props.loggedInStatus === "LOGGED_IN" ? <span>{props.user}</span> : <span></span>}
            {props.loggedInStatus === "NOT_LOGGED_IN" ? <Menu.Item as={NavLink} to="/login" name="login"/> : <Menu.Item as={NavLink} to="/logout" name="logout"/>}
            <Menu.Item as={NavLink} exact to="/help" activeClassName="active" name="help"/>
            <Menu.Item as={NavLink} exact to="/contact" activeClassName="active" name="contact"/>
        </Menu>
    )
}

NavigationBar.propTypes = {
    loggedInStatus: PropTypes.string,
};

NavigationBar.defaultProps = {
    loggedInStatus: "NOT_LOGGED_IN",
};

export default NavigationBar;