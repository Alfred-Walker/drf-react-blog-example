import React from 'react'
import PropTypes from 'prop-types';
import { Button, Icon, List, Segment } from 'semantic-ui-react'
import './TagList.css'


const TagList = (props) => {
    const key = 0;
    return (
        <Segment fluid="true" className='tag-list'>
            {props.tags === undefined ? "No tags registered yet..." : ""}
            <List horizontal>
                {
                    props.tags.map((tag, index) =>
                        <List.Item key={index}>
                            <Button name={tag.name} onClick={props.onClick} className='tag'>{tag.name}</Button>
                        </List.Item>
                    )
                }
            </List>
        </Segment>
    )
}

TagList.propTypes = {
    tags: PropTypes.array,
    onClick: PropTypes.func
};

TagList.defaultProps = {
    tags: [],
    onClick: undefined
};

export default TagList;