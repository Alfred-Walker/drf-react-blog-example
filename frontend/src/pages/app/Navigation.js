import React from 'react';
import { Responsive } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import NavDesktop from './navigation/NavDesktop';
import NavMobile from './navigation/NavMobile';


/* Tutorial Reference*/
/* https://reactgo.com/semantic-ui-react/ */
function NavigationBar(props) {
    return (
        <div>
            <Responsive {...Responsive.onlyMobile}>
                <NavMobile loggedInStatus={props.loggedInStatus}>
                    {props.children}
                </ NavMobile>
            </ Responsive>
            <Responsive minWidth={Responsive.onlyTablet.minWidth}>
                <NavDesktop loggedInStatus={props.loggedInStatus}>
                    {props.children}
                </NavDesktop>
            </ Responsive>
        </div>
    )
}

NavigationBar.propTypes = {
    loggedInStatus: PropTypes.string,
};

NavigationBar.defaultProps = {
    loggedInStatus: "NOT_LOGGED_IN",
};

export default NavigationBar;