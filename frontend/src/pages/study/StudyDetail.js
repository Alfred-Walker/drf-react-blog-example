import React, { useEffect, useState } from 'react'
import { Confirm } from 'semantic-ui-react'

import CommentThreaded from '../comment/CommentThreaded'
import CommandButtonGroup from '../../components/CommandButtonGroup';
import ReadOnlyQuillSegment from '../../components/ReadOnlyQuillSegment';
import * as Utils from '../../utils/jwt';


function StudyDetail(props) {
    const [study, setStudy] = useState(undefined);
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
        const id = study.id;

        setOpen(false);
        event.preventDefault();

        fetch(
            'http://localhost:8000/study/' + id + "/", {
            method: 'DELETE',
            headers: {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'application/json; charset="utf-8"'
            },
            credentials: 'include'
        }
        )
            .then(
                response => { props.history.push('/study/'); }
            )
            .catch(
                err => console.log("delete error", err)
            );
    };

    const onShow = () => {
        setOpen(true);
    };

    const onStudyLoadSuccess = (result) => {
        setStudy(result);
    }

    const onStudyLoadFailure = () => {
        // console.log("onLastStudyLoadFailure");
    }

    // similar to componentDidMount & componentDidUpdate of class components
    useEffect(() => {
        function fetchStudyData(loggedInStatus, id) {
            // TODO: Need to pass url from 'App.js' to 'StudyDetail.js' via props
            // TODO: All urls must be managed at one place together
            if (loggedInStatus === 'LOGGED_IN') {
                loadDataFromServer("http://localhost:8000/study/" + id, onStudyLoadSuccess, onStudyLoadFailure);
            }
        }

        if (!props.study)
            fetchStudyData(props.loggedInStatus, props.match.params.id);
    }, [props.loggedInStatus, props.match.params.id, props.study]);

    return (
        <div>
            {
                study && study.user ?
                    <div>
                        <ReadOnlyQuillSegment
                            is_public={study.is_public}
                            title={study.title}
                            body={study.body}
                            nickname={study.user.nickname}
                            registered_date={study.registered_date}
                            tags={study.tags}
                        />

                        <CommandButtonGroup
                            id_parent={study.id}
                            edit_page_path={"/study/edit/" + study.id}
                            state={{study: study}}
                            onDeleteClick={onShow}
                        />

                        <Confirm
                            open={open}
                            content='Do you really want to delete?'
                            onCancel={onCancel}
                            onConfirm={onDelete}
                        />
                        <CommentThreaded {...props} comments={study.comment} parent_study={study.id}></CommentThreaded>
                    </div>
                    : ""
                    // TODO: contents to show when the fetch failed need to be added
            }
        </div>
    )
}
export default StudyDetail;
