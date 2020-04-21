import React, { useEffect, useState } from 'react'
import { Confirm } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import CommentThreaded from '../comment/CommentThreaded'
import CommandButtonGroup from '../../components/CommandButtonGroup';
import ReadOnlyQuillSegment from '../../components/ReadOnlyQuillSegment';
import handleHttpResponseError from '../../utils/httpResponseError';
import * as jwtUtil from '../../utils/jwt';
import * as Urls from '../Urls';


function QuestionDetail(props) {
    const [question, setQuestion] = useState(undefined);
    const [open, setOpen] = useState(false);

    const loadDataFromServer = (url, callbackOnSuccess) => {
        let headers = {};
        const jwt = jwtUtil.getJwt();

        if (jwt) {
            headers = {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'Application/json'
            };
        }

        fetch(
            url, {
            method: 'GET',
            headers: headers,
            credentials: 'include'
        }
        )
            .then(handleHttpResponseError)
            .then(response => response.json())
            .then(
                result => {
                    callbackOnSuccess(result);
                }
            )
            .catch(error => this.props.history.push('/' + error.message));
    }

    const onCancel = () => { setOpen(false) };

    const onDelete = (event) => {
        const jwt = jwtUtil.getJwt();
        const id = question.id;

        setOpen(false);
        event.preventDefault();

        fetch(
            Urls.URL_QUESTION_LIST + id + "/", {
            method: 'DELETE',
            headers: {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'application/json; charset="utf-8"'
            },
            credentials: 'include'
        }
        )
            .then(handleHttpResponseError)
            .then(response => { props.history.push('/question/'); })
            .catch(error => this.props.history.push('/' + error.message));
    };

    const onShow = () => {
        setOpen(true);
    };

    const onQuestionLoadSuccess = (result) => {
        setQuestion(result);
    }

    // similar to componentDidMount & componentDidUpdate of class components
    useEffect(() => {
        function fetchQuestionData(loggedInStatus, id) {
            // TODO: Need to pass url from 'App.js' to 'QuestionDetail.js' via props
            // TODO: All urls must be managed at one place together
            loadDataFromServer(Urls.URL_QUESTION_LIST + id, onQuestionLoadSuccess);
        }

        if (!props.question)
            fetchQuestionData(props.loggedInStatus, props.match.params.id);
    }, [props.loggedInStatus, props.match.params.id, props.question]);

    return (
        <div>
            {
                question && question.user ?
                    <div>
                        <ReadOnlyQuillSegment
                            is_public={question.is_public}
                            title={question.title}
                            body={question.body}
                            nickname={question.user.nickname}
                            registered_date={question.registered_date}
                            tags={question.tags}
                        />

                        {
                            props.user && question.user && question.user.id === props.user.id ?
                                <CommandButtonGroup
                                    id_parent={question.id}
                                    edit_page_path={"/question/edit/" + question.id}
                                    state={{ question: question }}
                                    onDeleteClick={onShow}
                                />
                                : ""
                        }

                        <Confirm
                            open={open}
                            content='Do you really want to delete?'
                            onCancel={onCancel}
                            onConfirm={onDelete}
                        />
                        <CommentThreaded {...props} comments={question.comment} parent_question={question.id}></CommentThreaded>
                    </div>
                    : ""
            }
        </div>
    )
}

QuestionDetail.propTypes = {
    history: PropTypes.object,
    loggedInStatus: PropTypes.string,
    user: PropTypes.object,
    question: PropTypes.object,
};

QuestionDetail.defaultProps = {
    history: undefined,
    loggedInStatus: "NOT_LOGGED_IN",
    user: undefined,
    question: undefined,
};

export default QuestionDetail;
