import { Box, Typography } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { useCommentsQuery } from "../graphql/generated/graphql";
import useGetPostFromRoute from "../utils/useGetPostFromRoute";
import PostComment from "./PostComments";

const StyledCardBody = styled.div`
  display: block;
  padding: 10px;
`;

const StyledComment = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  margin: 5px;
`;

const CommentsSection: React.FC = () => {
  const { data: postData } = useGetPostFromRoute();
  const { data, loading } = useCommentsQuery({
    variables: {
      postId: postData.post.id,
      limit: 10,
      parentPath: "/",
    },
  });

  console.log(data, loading);

  const comments = data?.comments?.map((comment) => {
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
          <Typography variant="body2">{comment.comment}</Typography>
        </Box>
      </StyledComment>
    );
  });

  return (
    <StyledCardBody>
      <PostComment />
      <Box display="flex" flexDirection="column">
        {comments}
      </Box>
    </StyledCardBody>
  );
};

export default CommentsSection;
