import React from 'react'
import PropTypes from 'prop-types';
import {
    Divider,
    Header,
} from 'semantic-ui-react'

import TitleList from '../components/TitleList'
import * as Urls from './Urls';


function Tags(props) {
    return (
        <div>
            <Header as='h1'>Tag: {props.match.params.tag}</Header>
            <Divider />
            <br />
            <br />
            <TitleList
                {...props}
                url={props.taggedStudyUrl + props.match.params.tag}
                itemPath={props.studyItemPath}
                perPageCount={10}
                header="Study"
            />
            <br />
            <br />
            <br />
            <TitleList
                {...props}
                url={props.taggedQuestionUrl + props.match.params.tag}
                itemPath={props.questionItemPath}
                header="Question"
                icon="question"
            />
        </div>
    )
}

Tags.propTypes = {
    taggedStudyUrl: PropTypes.string,
    taggedQuestionUrl: PropTypes.string,
    studyItemPath: PropTypes.string,
    questionItemPath: PropTypes.string,
};

Tags.defaultProps = {
    taggedStudyUrl: Urls.URL_TAGGED_STUDY,
    taggedQuestionUrl: Urls.URL_TAGGED_QUESTION,
    studyItemPath: "/study/",
    questionItemPath: "/question/",
};

export default Tags;
