import React from 'react';
import { Menu } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import { NavLink } from "react-router-dom";
import './Navigation.css';


const NavDesktop = (props) => {
    return (
        <div>
            <Menu fixed='top' pointing>
                <Menu.Item as={NavLink} exact to="/" activeClassName="active" name="home" />
                {props.loggedInStatus === "LOGGED_IN" ? <Menu.Item as={NavLink} to="/study/new" activeClassName="active" name="new" /> : <span></span>}
                <Menu.Item as={NavLink} exact to="/study" activeClassName="active" name="studies" />
                <Menu.Item as={NavLink} to="/question" activeClassName="active" name="Questions" />
                <Menu.Item name={props.user} className="nav-right" />
                {props.loggedInStatus === "LOGGED_IN" ? <span>{props.user}</span> : <span></span>}
                {props.loggedInStatus === "NOT_LOGGED_IN" ? <Menu.Item as={NavLink} to="/login" name="login" /> : <Menu.Item as={NavLink} to="/logout" name="logout" />}
                {props.loggedInStatus === "NOT_LOGGED_IN" ? <Menu.Item as={NavLink} exact to="/registration" activeClassName="active" name="registration" /> : <span></span>}
            </Menu>
            {props.children}
        </div>
    )
}

NavDesktop.propTypes = {
    history: PropTypes.object,
    loggedInStatus: PropTypes.string,
};

NavDesktop.defaultProps = {
    history: undefined,
    loggedInStatus: "NOT_LOGGED_IN",
};

export default NavDesktop;