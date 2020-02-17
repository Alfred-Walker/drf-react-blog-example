import React from 'react'
import PropTypes from 'prop-types';
import Summary from './summary/Summary';


function LastStudy(props) {
    return (
        props.study && props.study.user ?
        <Summary 
            id={props.study.id} 
            title={props.study.title}
            body={props.study.body}
            author={props.study.user.nickname}
            created_date={props.study.registered_date}
            link_path={props.study_link_path + props.study.id}
        /> :
        <Summary />
    )
}

LastStudy.propTypes = {
    study: PropTypes.object,
    study_link_path: PropTypes.string
};

LastStudy.defaultProps = {
    study: undefined,
    study_link_path: "/study/"
};

export default LastStudy;
