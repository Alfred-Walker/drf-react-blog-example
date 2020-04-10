import PropTypes from 'prop-types';
import * as jwtUtil from '../utils/jwt';


const Logout = (props) => {
    jwtUtil.clearJwt();
    props.onLogout();
    props.history.push('/');

    return null;
}

Logout.propTypes = {
    history: PropTypes.object,
    onLogout: PropTypes.func
};

Logout.defaultProps = {
    history: undefined,
    onLogout: undefined
};

export default Logout;