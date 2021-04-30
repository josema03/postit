import { Box, Button, CircularProgress } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { Comment, useCommentsQuery } from "../graphql/generated/graphql";
import useEvictQueryOnUnmount from "../utils/useEvictQueryOnUnmount";
import useGetPostFromRoute from "../utils/useGetPostFromRoute";
import CommentComponent from "./CommentComponent";
import PostComment from "./PostComments";

const StyledCardBody = styled.div`
  display: block;
  padding: 10px;
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
      limit: 10,
      parentPath: "/",
    },
  });

  const comments = data?.comments?.result?.map((comment) => {
    return <CommentComponent comment={comment as Comment} key={comment.id} />;
  });

  const loadMore = () => {
    const cursor =
      data.comments.result[data.comments.result.length - 1].id || null;
    const limit = commentsQueryVariables?.limit;
    fetchMore({
      variables: { limit, cursor: String(cursor) },
    });
  };

  useEvictQueryOnUnmount({ id: "ROOT_QUERY", fieldName: "comments" });

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
