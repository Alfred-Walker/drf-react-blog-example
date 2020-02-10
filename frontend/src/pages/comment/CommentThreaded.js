import React, { useState } from 'react'
import PropTypes from 'prop-types';
import { Accordion, Button, Comment, Form, Header, Grid } from 'semantic-ui-react'
import ChildComment from './ChildComment';
import * as Utils from '../../utils/jwt'


function CommentThreaded(props) {
  // Declare a new state variable, which we'll call "count" 
  const [replyToComment, setReplyToComment] = useState("");
  const [replyToCommentEnabled, setReplyToCommentEnabled] = useState(false);
  const [replyToParent, setReplyToParent] = useState("");
  const [replyToParentEnabled, setReplyToParentEnabled] = useState(false);
  const [activeComment, setActiveComment] = useState(-1);
  const [isPublicReply, setIsPublicReply] = useState(true);

  const checkReplyToCommentEnabled = (text) => {
    if (!text)
      setReplyToCommentEnabled(false);
    else
      setReplyToCommentEnabled(true);
  }

  const checkReplyToParentEnabled = (text) => {
    if (!text)
      setReplyToParentEnabled(false);
    else
      setReplyToParentEnabled(true);
  }

  const handleReplyToCommentChange = (event) => {
    setReplyToComment(event.target.value);
    checkReplyToCommentEnabled(event.target.value);
  }

  const handleReplyToParentChange = (event) => {
    setReplyToParent(event.target.value);
    checkReplyToParentEnabled(event.target.value);
  }

  const handleDeleteClick = (event) => {
    const jwt = Utils.getJwt();
    const id = event.target.name;

    event.preventDefault();

    fetch(
      'http://localhost:8000/comment/' + id + "/", {
      method: 'DELETE',
      headers: {
        'Authorization': `JWT ${jwt}`,
        'Content-Type': 'application/json; charset="utf-8"'
      },
      credentials: 'include'
    }
    )
      .then(
        response => window.location.reload()
      )
      .catch(
        err => console.log("delete error", err)
      );
  }

  const handleReplyClick = (e, index) => {
    const newComment = activeComment === e.target.name ? undefined : e.target.name
    setActiveComment(newComment);
    setReplyToComment("");
    checkReplyToCommentEnabled("");
  }

  const handleSubmit = (event) => {
    const jwt = Utils.getJwt();
    event.preventDefault();

    let parent_study = undefined;
    let parent_question = undefined;
    let parent_comment = undefined;
    let text = undefined;

    if (event.target.name === "commentReply") {
      parent_comment = activeComment;
      text = replyToComment;
    } else {
      if (props.parent_study)
        parent_study = event.target.name === "parentReply" ? props.parent_study : undefined;

      if (props.parent_question)
        parent_question = event.target.name === "parentReply" ? props.parent_question : undefined;

      parent_comment = undefined;
      text = replyToParent;
    }

    fetch(
      'http://localhost:8000/comment/', {
      method: 'POST',
      headers: {
        'Authorization': `JWT ${jwt}`,
        'Content-Type': 'application/json; charset="utf-8"'
      },
      body: JSON.stringify({
        text: text,
        is_public: isPublicReply,
        parent_study: parent_study,
        parent_question: parent_question,
        parent_comment: parent_comment
      }),
      credentials: 'include'
    }
    )
      .then(
        response => (response.json())
      )
      .then(
        result => {
          // TODO: Need to change page reload with comments update
          window.location.reload();
        }
      )
      .catch(
        err => console.log("login error", err)
      );
  }

  const handleToggleChange = (event, { name, checked }) => {
    if (name === "isPublic") {
      setIsPublicReply(checked);
    }
  }

  return (
    <Comment.Group threaded>
      <Header as='h3' dividing>
        Comments
    </Header>

      {
        props.comments.map((comment, index) =>
          <Comment.Group threaded>
            <Comment key={index}>
              <Comment.Avatar as='a' src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
              <Comment.Content>
                <Comment.Author as='a'>{comment.user.nickname}</Comment.Author>
                <Comment.Metadata>
                  <span>{comment.created_date}</span>
                  {
                    comment.is_public ? ", public" : ", private"
                  }
                </Comment.Metadata>
                <Comment.Text>{comment.text}</Comment.Text>
                <Comment.Actions>
                  {
                    comment.is_active && props.loggedInStatus === "LOGGED_IN" ?
                      <Accordion>
                        <Accordion.Title active={false}>
                          <a name={comment.id} className="ui small header" onClick={handleReplyClick}>Reply</a>
                          <a name={comment.id} className="ui small red header" onClick={handleDeleteClick}>Delete</a>
                        </Accordion.Title>
                        <Accordion.Content active={activeComment == comment.id}>
                          <Form name="commentReply" reply onSubmit={handleSubmit}>
                            <Form.Checkbox
                              name='isPublic'
                              checked={isPublicReply}
                              defaultChecked={isPublicReply}
                              onChange={handleToggleChange}
                              label='Is Public'
                              toggle
                            />
                            <Form.TextArea onChange={handleReplyToCommentChange} />
                            {
                              replyToCommentEnabled ?
                              <Button content='Add Reply' labelPosition='left' icon='edit' primary /> :
                              <Button content='Add Reply' labelPosition='left' icon='edit' primary disabled />
                            }
                          </Form>
                        </Accordion.Content>
                      </Accordion>
                      : ""
                  }
                </Comment.Actions>
              </Comment.Content>
              <Comment.Group>
                {
                  comment.child_comment.map((child, childIndex) =>
                    <ChildComment
                      {...props}
                      key={childIndex}
                      id={child.id}
                      user={child.user}
                      is_active={child.is_active}
                      is_public={child.is_public}
                      created_date={child.created_date}
                      text={child.text}
                    />
                  )
                }
              </Comment.Group>
            </Comment>
          </Comment.Group>
        )
      }

      <Form name="parentReply" reply onSubmit={handleSubmit}>
        <Form.TextArea onChange={handleReplyToParentChange} value={replyToParent} />
        <Form.Checkbox
          name='isPublic'
          checked={isPublicReply}
          defaultChecked={isPublicReply}
          onChange={handleToggleChange}
          label='Is Public'
          toggle
        />
        {
          replyToParentEnabled ?
            <Button content='Add Reply' labelPosition='left' icon='edit' primary /> :
            <Button content='Add Reply' labelPosition='left' icon='edit' primary disabled />
        }
      </Form>
    </Comment.Group >
  )
}

CommentThreaded.propTypes = {
  history: PropTypes.object,
  comments: PropTypes.array,
  parent_study: PropTypes.number,
  parent_question: PropTypes.number,
};

CommentThreaded.defaultProps = {
  history: undefined,
  comments: [],
  parent_study: undefined,
  parent_question: undefined
};

export default CommentThreaded