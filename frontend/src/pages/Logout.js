function Logout(props) {
    localStorage.clear();
    props.handleLogout();
    props.history.push('/');

    return null;
}

export default Logout;