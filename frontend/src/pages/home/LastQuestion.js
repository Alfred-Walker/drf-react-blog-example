import React from 'react'
import PropTypes from 'prop-types';
import Summary from './summary/Summary';


function LastQuestion(props) {
    return (
        props.question ?
        <Summary 
            id={props.question.id} 
            title={props.question.title}
            body={props.question.body}
            author={props.question.user.nickname}
            created_date={props.question.registered_date}
            link_path={props.question_link_path + props.question.id}
        /> : 
        <Summary />
    )
}

LastQuestion.propTypes = {
    question: PropTypes.object,
    question_link_path: PropTypes.string
};

LastQuestion.defaultProps = {
    question: undefined,
    question_link_path: "/question/"
};

export default LastQuestion;
