import React from 'react'
import PropTypes from 'prop-types';
import { Comment } from 'semantic-ui-react'
import * as Utils from '../../utils/jwt'
import * as Urls from '../Urls';


function ChildComment(props) {
    const handleDeleteClick = (event) => {
        const jwt = Utils.getJwt();
        const id = props.id;

        event.preventDefault();

        fetch(
            Urls.URL_COMMENT + id + "/", {
            method: 'DELETE',
            headers: {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'application/json; charset="utf-8"'
            },
            credentials: 'include'
        }
        )
            .then(
                response => window.location.reload()
            )
            .catch(
                err => console.log("delete error", err)
            );
    }

    return (
        <Comment>
            <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
            <Comment.Content>
                <Comment.Author as='a'>{props.user.nickname}</Comment.Author>
                <Comment.Metadata>
                    <span>{props.created_date}</span>
                    {
                        props.is_public ? ", public" : ", private"
                    }
                </Comment.Metadata>
                <Comment.Text>{props.text}</Comment.Text>
                {
                    props.is_active && props.loggedInStatus === "LOGGED_IN" ?
                        <Comment.Actions>
                            <a className="ui small red header" onClick={handleDeleteClick}>Delete</a>
                        </Comment.Actions>
                        : ""
                }
            </Comment.Content>
        </Comment>
    )
}

ChildComment.propTypes = {
    id: PropTypes.number,
    user: PropTypes.object,
    created_date: PropTypes.string,
    text: PropTypes.string
};

ChildComment.defaultProps = {
    id: undefined,
    user: { "nickname": "default_nickname" },
    created_date: "default_date",
    text: "default text"
};

export default ChildComment;