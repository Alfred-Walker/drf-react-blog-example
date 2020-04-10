import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react'


const CommandButtonGroup = (props) => {
    return (
        <div>
            <Button
                as={Link}
                to={{ pathname: props.edit_page_path, state: props.state }}
                primary
                basic
            >
                Edit
            </Button>

            <Button
                name={props.id_parent}
                onClick={props.onDeleteClick}
                primary
                basic
                negative
            >
                Delete
            </Button>
        </div>
    )
}

CommandButtonGroup.propTypes = {
    id_parent: PropTypes.number,
    edit_page_path: PropTypes.string,
    state: PropTypes.object,
    onDeleteClick: PropTypes.func
};

CommandButtonGroup.defaultProps = {
    id_parent: undefined,
    edit_page_path: "/",
    state: undefined,
    onDeleteClick: undefined
};

export default CommandButtonGroup;
