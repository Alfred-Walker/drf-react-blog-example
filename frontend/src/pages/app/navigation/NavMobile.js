import React, { useState } from 'react';
import { Icon, Menu, Sidebar } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import { NavLink } from "react-router-dom";
import './Navigation.css';


const NavMobile = (props) => {
    const [visible, setVisible] = useState(false);

    return (
        <Sidebar.Pushable>
            <Sidebar
                as={Menu}
                animation="overlay"
                icon="labeled"
                vertical
                visible={visible}
            >
                <Menu.Item as={NavLink} exact to="/" activeClassName="active" name="home" />
                {props.loggedInStatus === "LOGGED_IN" ? <Menu.Item as={NavLink} to="/study/new" activeClassName="active" name="new" /> : <span></span>}
                <Menu.Item as={NavLink} exact to="/study" activeClassName="active" name="studies" />
                <Menu.Item as={NavLink} to="/question" activeClassName="active" name="Questions" />
            </ Sidebar>
            <Sidebar.Pusher
                dimmed={visible}
                onClick={() => visible? setVisible(!visible): ""}
                style={{ minHeight: "100vh" }}
            >
                <Menu fixed='top' pointing>
                    <Menu.Item onClick={() => setVisible(!visible)}>
                        <Icon name="sidebar" />
                    </Menu.Item>
                    <Menu.Menu position="right">
                        {props.loggedInStatus === "LOGGED_IN" ? <span>{props.user}</span> : <span></span>}
                        {props.loggedInStatus === "NOT_LOGGED_IN" ? <Menu.Item as={NavLink} to="/login" name="login" /> : <Menu.Item as={NavLink} to="/logout" name="logout" />}
                        {props.loggedInStatus === "NOT_LOGGED_IN" ? <Menu.Item as={NavLink} exact to="/registration" activeClassName="active" name="registration" /> : <span></span>}
                    </Menu.Menu>
                </Menu>
                {props.children}
            </Sidebar.Pusher>
        </Sidebar.Pushable>
    )
}

NavMobile.propTypes = {
    history: PropTypes.object,
    loggedInStatus: PropTypes.string,
};

NavMobile.defaultProps = {
    history: undefined,
    loggedInStatus: "NOT_LOGGED_IN",
};

export default NavMobile;