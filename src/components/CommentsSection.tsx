import { Box, Button, CircularProgress } from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import { Comment, useCommentsQuery } from "../graphql/generated/graphql";
import useEvictQueryOnUnmount from "../utils/useEvictQueryOnUnmount";
import useGetPostFromRoute from "../utils/useGetPostFromRoute";
import CommentComponent from "./CommentComponent";

const StyledCardBody = styled.div`
  display: block;
  max-width: 100%;
  width: 100%;
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

interface CommentsSectionProps {
  parentPath?: string;
  limit?: number;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({
  parentPath = "/",
  limit = 10,
}) => {
  // const [loadingComments, setLoadingComments] = useState(false);
  const { data: postData } = useGetPostFromRoute();
  const { data, loading, fetchMore } = useCommentsQuery({
    variables: {
      postId: postData.post.id,
      limit,
      parentPath,
    },
    notifyOnNetworkStatusChange: true,
  });

  const comments = data?.comments?.result
    ?.filter((comment) => comment.parentPath === parentPath)
    .map((comment) => {
      return <CommentComponent comment={comment as Comment} key={comment.id} />;
    });

  const loadMore = async () => {
    const cursor =
      data.comments.result[data.comments.result.length - 1].id || null;
    await fetchMore({
      variables: { limit, cursor: String(cursor) },
    });
  };

  useEvictQueryOnUnmount(
    { id: "ROOT_QUERY", fieldName: "comments" },
    parentPath === "/"
  );

  return (
    <StyledCardBody>
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
            {parentPath === "/"
              ? "Load more comments..."
              : "Load more responses..."}
          </Button>
          {loading && <StyledSubmitProgress size={24} />}
        </StyledWrapper>
      )}
    </StyledCardBody>
  );
};

export default CommentsSection;
