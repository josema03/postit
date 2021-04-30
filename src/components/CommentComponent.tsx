import { Box, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { Comment } from "../graphql/generated/graphql";

const StyledComment = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  margin: 5px;
`;

interface CommentProps {
  comment: Comment;
}

const CommentComponent: React.FC<CommentProps> = ({ comment }) => {
  return (
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
    </StyledComment>
  );
};

export default CommentComponent;
