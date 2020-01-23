import PropTypes from 'prop-types';
import * as Utils from '../utils/jwt';


const Logout = (props) => {
    Utils.clearJwt();
    props.handleLogout();
    props.history.push('/');

    return null;
}

Logout.propTypes = {
    history: PropTypes.object,
    handleLogout: PropTypes.func
};

Logout.defaultProps = {
    history: undefined,
    handleLogout: undefined
};

export default Logout;