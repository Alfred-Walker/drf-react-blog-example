import React, { useEffect, useState } from 'react'
import { Confirm } from 'semantic-ui-react'

import CommentThreaded from '../comment/CommentThreaded'
import CommandButtonGroup from '../../components/CommandButtonGroup';
import ReadOnlyQuillSegment from '../../components/ReadOnlyQuillSegment';
import * as Utils from '../../utils/jwt';


function QuestionDetail(props) {
    const [question, setQuestion] = useState(undefined);
    const [open, setOpen] = useState(false);

    const loadDataFromServer = (url, callbackOnSuccess, callbackOnError) => {
        let headers = {};
        const jwt = Utils.getJwt();

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
            .then(
                response => (response.json())
            )
            .then(
                result => {
                    callbackOnSuccess(result);
                }
            )
            .catch(
                // TODO: need better catch.
                err => {
                    callbackOnError();
                }
            );
    }

    const onCancel = () => { setOpen(false) };

    const onDelete = (event) => {
        const jwt = Utils.getJwt();
        const id = question.id;

        setOpen(false);
        event.preventDefault();

        fetch(
            'http://localhost:8000/question/' + id + "/", {
            method: 'DELETE',
            headers: {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'application/json; charset="utf-8"'
            },
            credentials: 'include'
        }
        )
            .then(
                response => { props.history.push('/question/'); }
            )
            .catch(
                err => console.log("delete error", err)
            );
    };

    const onShow = () => {
        setOpen(true);
    };

    const onQuestionLoadSuccess = (result) => {
        setQuestion(result);
    }

    const onQuestionLoadFailure = () => {
        // console.log("onLastQuestionLoadFailure");
    }

    // similar to componentDidMount & componentDidUpdate of class components
    useEffect(() => {
        function fetchQuestionData(loggedInStatus, id) {
            // TODO: Need to pass url from 'App.js' to 'QuestionDetail.js' via props
            // TODO: All urls must be managed at one place together
            if (loggedInStatus === 'LOGGED_IN') {
                loadDataFromServer("http://localhost:8000/question/" + id, onQuestionLoadSuccess, onQuestionLoadFailure);
            }
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

                        <CommandButtonGroup
                            id_parent={question.id}
                            edit_page_path={"/question/edit/" + question.id}
                            state={{question: question}}
                            onDeleteClick={onShow}
                        />

                        <Confirm
                            open={open}
                            content='Do you really want to delete?'
                            onCancel={onCancel}
                            onConfirm={onDelete}
                        />
                        <CommentThreaded {...props} comments={question.comment} parent_question={question.id}></CommentThreaded>
                    </div>
                    : ""
                    // TODO: contents to show when the fetch failed need to be added
            }
        </div>
    )
}
export default QuestionDetail;
