import { Box, Button, CircularProgress, Typography } from "@material-ui/core";
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

const StyledWrapper = styled.div`
  position: relative;
  margin: auto;
  width: 50%;
`;

const StyledSubmitProgress = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`;

const CommentsSection: React.FC = () => {
  const { data: postData } = useGetPostFromRoute();
  const {
    data,
    loading,
    fetchMore,
    variables: commentsQueryVariables,
  } = useCommentsQuery({
    variables: {
      postId: postData.post.id,
      limit: 1,
      parentPath: "/",
    },
  });

  const comments = data?.comments?.result?.map((comment) => {
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
  });

  const loadMore = () => {
    const cursor =
      data.comments.result[data.comments.result.length - 1].id || null;
    const limit = commentsQueryVariables?.limit;
    fetchMore({
      variables: { limit, cursor: String(cursor) },
    });
  };

  return (
    <StyledCardBody>
      <PostComment />
      <Box display="flex" flexDirection="column">
        {comments}
      </Box>
      {data?.comments?.hasMore && (
        <StyledWrapper>
          <Button
            fullWidth
            color="primary"
            disabled={loading}
            onClick={() => loadMore()}
          >
            Load more...
          </Button>
          {loading && <StyledSubmitProgress size={24} />}
        </StyledWrapper>
      )}
    </StyledCardBody>
  );
};

export default CommentsSection;
