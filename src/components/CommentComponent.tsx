import { Box, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { Comment } from "../graphql/generated/graphql";
import CommentsSection from "./CommentsSection";

const StyledComment = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  margin: 5px;
`;

const StyledResponsesWrapper = styled.div`
  margin-left: auto;
  width: 100%;
`;

interface CommentProps {
  comment: Comment;
}

const CommentComponent: React.FC<CommentProps> = ({ comment }) => {
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
        {commentResponses}
      </StyledComment>
    </>
  );
};

export default CommentComponent;
