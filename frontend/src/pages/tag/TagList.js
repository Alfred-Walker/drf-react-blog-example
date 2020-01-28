import React from 'react'
import PropTypes from 'prop-types';
import { Button, Icon, List, Segment } from 'semantic-ui-react'
import './TagList.css'


const TagList = (props) => {
    return (
        <Segment fluid className='tag-list'>
            <Icon name='hashtag' size='big' />
            <List horizontal>
                {
                    props.tags.map(tag =>
                        <List.Item key={tag.id}>
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
    tags: undefined,
    onClick: undefined
};

export default TagList;