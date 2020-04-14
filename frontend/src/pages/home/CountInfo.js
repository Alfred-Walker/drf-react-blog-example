import React from 'react'
import PropTypes from 'prop-types';
import { List, Icon } from 'semantic-ui-react'


function CountInfo(props) {
    return (
        <List horizontal>
            <List.Item><Icon name='user' /> User: { props.user_count.toLocaleString() } </List.Item>
            <List.Item><Icon name='book' /> Study: { props.study_count.toLocaleString() } </List.Item>
            <List.Item><Icon name='question' /> Question: { props.question_count.toLocaleString() } </List.Item>
            <List.Item><Icon name='comment' /> Comment: { props.comment_count.toLocaleString() } </List.Item>
            <List.Item><Icon name='tag' /> Tag: { props.tag_count.toLocaleString() } </List.Item>
        </List>
    )
}

CountInfo.propTypes = {
    user_count: PropTypes.number,
    study_count: PropTypes.number,
    question_count: PropTypes.number,
    comment_count: PropTypes.number,
    tag_count: PropTypes.number,
};

CountInfo.defaultProps = {
    user_count: 0,
    study_count: 0,
    question_count: 0,
    comment_count: 0,
    tag_count: 0,
};

export default CountInfo;
