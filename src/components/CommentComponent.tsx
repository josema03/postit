import { Box, IconButton, Typography } from "@material-ui/core";
import React, { useState } from "react";
import styled from "styled-components";
import { Comment } from "../graphql/generated/graphql";
import CommentsSection from "./CommentsSection";
import ReplyIcon from "@material-ui/icons/Reply";
import PostComment from "./PostComments";

const StyledComment = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  margin: 5px;
`;

const StyledResponsesWrapper = styled.div`
  margin-left: auto;
  width: calc(100% - 10px);
  border-left: groove 1px;
`;

const StyledPostReplyWrapper = styled.div`
  margin-left: auto;
  width: calc(100% - 10px);
`;

interface CommentProps {
  comment: Comment;
}

const CommentComponent: React.FC<CommentProps> = ({ comment }) => {
  const [isReplying, setIsReplying] = useState(false);

  const replyToComment = () => {
    setIsReplying(true);
  };

  const postReply = isReplying ? (
    <StyledPostReplyWrapper>
      <PostComment
        parentPath={`/${comment.id}/`}
        parentComment={comment}
        isReplying={isReplying}
        setIsReplying={setIsReplying}
      />
    </StyledPostReplyWrapper>
  ) : null;

  const commentResponses = comment.hasResponse ? (
    <StyledResponsesWrapper>
      <CommentsSection
        parentPath={`/${comment.id}/`}
        limit={5}
        key={`responses-${comment.id}`}
      />
    </StyledResponsesWrapper>
  ) : null;

  return (
    <>
      <StyledComment key={comment.id}>
        <Box display="flex" alignItems="flex-end">
          <Typography variant="subtitle2">{comment.user.username}</Typography>
          <Box marginLeft="5px">
            <Typography variant="caption" color="textSecondary">
              At {comment.createdAt}
            </Typography>
          </Box>
        </Box>
        <Box>
          <Typography variant="body2">{comment.text}</Typography>
        </Box>
        <Box>
          <IconButton onClick={() => replyToComment()}>
            <ReplyIcon />
          </IconButton>
        </Box>
      </StyledComment>
      {postReply}
      {commentResponses}
    </>
  );
};

export default CommentComponent;
