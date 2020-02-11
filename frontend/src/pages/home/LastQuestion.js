import React from 'react'
import PropTypes from 'prop-types';
import Summary from './summary/Summary';


function LastQuestion(props) {
    return (
        <Summary 
            id={props.question.id} 
            title={props.question.title}
            body={props.question.body}
            created_date={props.question.created_date}
            link_path={props.question_link_path + props.question.id}
        />
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
