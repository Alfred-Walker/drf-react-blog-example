import React, { useEffect, useState } from 'react'
import { Confirm } from 'semantic-ui-react'
import PropTypes from 'prop-types';
import CommentThreaded from '../comment/CommentThreaded'
import CommandButtonGroup from '../../components/CommandButtonGroup';
import ReadOnlyQuillSegment from '../../components/ReadOnlyQuillSegment';
import handleHttpResponseError from '../../utils/httpResponseError';
import jwtUtil from '../../utils/jwt';
import * as Urls from '../Urls';


function StudyDetail(props) {
    const [study, setStudy] = useState(undefined);
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
        const id = study.id;

        setOpen(false);
        event.preventDefault();

        fetch(
            Urls.URL_STUDY_LIST + id + "/", {
            method: 'DELETE',
            headers: {
                'Authorization': `JWT ${jwt}`,
                'Content-Type': 'application/json; charset="utf-8"'
            },
            credentials: 'include'
        }
        )
            .then(handleHttpResponseError)
            .then(response => { props.history.push('/study/'); })
            .catch(error => this.props.history.push('/' + error.message));
    };

    const onShow = () => {
        setOpen(true);
    };

    const onStudyLoadSuccess = (result) => {
        setStudy(result);
    }

    // similar to componentDidMount & componentDidUpdate of class components
    useEffect(() => {
        function fetchStudyData(loggedInStatus, id) {
            // TODO: Need to pass url from 'App.js' to 'StudyDetail.js' via props
            // TODO: All urls must be managed at one place together
            loadDataFromServer(Urls.URL_STUDY_LIST + id, onStudyLoadSuccess);
        }

        if (!props.study)
            fetchStudyData(props.loggedInStatus, props.match.params.id);

    }, [props.loggedInStatus, props.match.params.id, props.study, props.user]);

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

                        {
                            props.user && study.user && study.user.id === props.user.id ?
                                <CommandButtonGroup
                                    id_parent={study.id}
                                    edit_page_path={"/study/edit/" + study.id}
                                    state={{ study: study }}
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
                        <CommentThreaded {...props} comments={study.comment} parent_study={study.id}></CommentThreaded>
                    </div>
                    : ""
            }
        </div>
    )
}

StudyDetail.propTypes = {
    history: PropTypes.object,
    loggedInStatus: PropTypes.string,
    user: PropTypes.object,
    study: PropTypes.object,
};

StudyDetail.defaultProps = {
    history: undefined,
    loggedInStatus: "NOT_LOGGED_IN",
    user: undefined,
    study: undefined,
};

export default StudyDetail;
