import { Box, Button, CircularProgress, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import React from "react";
import styled from "styled-components";
import * as yup from "yup";
import {
  Comment,
  CommentsDocument,
  CommentSnippetFragmentDoc,
  CommentsQuery,
  CommentsQueryVariables,
  PaginatedComments,
  PaginatedCommentsSnippetFragmentDoc,
  usePostCommentMutation,
} from "../graphql/generated/graphql";
import useGetPostFromRoute from "../utils/useGetPostFromRoute";

const StyledForm = styled.form<{ parentPath: string }>`
  display: flex;
  padding: ${(props) =>
    props.parentPath === "/" ? "20px 20px 0px 20px" : "10px"};
  flex-direction: column;
  width: 100%;
`;

const StyledTextField = styled(TextField).attrs(() => ({
  fullWidth: true,
  multiline: true,
  size: "small",
}))`
  margin-bottom: 5px;
`;

const StyledButtonWrapper = styled.div`
  position: relative;
  margin: 0px;
  width: 100px;
`;

const StyledSubmitProgress = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`;

const validationSchema = yup.object({
  comment: yup.string(),
});
interface PostCommentProps {
  parentPath: string;
  parentComment?: Comment;
  isReplying?: boolean;
  setIsReplying?: (newState: boolean) => void;
}

const PostComment: React.FC<PostCommentProps> = ({
  parentPath = "/",
  parentComment,
  isReplying = true,
  setIsReplying,
}) => {
  const { data } = useGetPostFromRoute();
  const [postComment] = usePostCommentMutation({
    update: (cache, { data: postedCommentData }) => {
      const previousQuery = cache.readFragment<
        PaginatedComments,
        CommentsQueryVariables
      >({
        id: `PaginatedComments:${parentPath}`,
        fragment: PaginatedCommentsSnippetFragmentDoc,
        fragmentName: "PaginatedCommentsSnippet",
      });
      if (previousQuery) {
        cache.writeQuery<CommentsQuery, CommentsQueryVariables>({
          query: CommentsDocument,
          data: {
            comments: {
              __typename: "PaginatedComments",
              id: parentPath,
              hasMore: previousQuery.hasMore,
              result: [postedCommentData.postComment, ...previousQuery.result],
            },
          },
        });
      }
      if (parentPath !== "/" && parentComment?.hasResponse === false) {
        cache.writeFragment({
          id: `Comment:${parentComment.id}`,
          fragment: CommentSnippetFragmentDoc,
          data: {
            ...parentComment,
            hasResponse: true,
          },
        });
      }
    },
  });

  const formik = useFormik({
    initialValues: {
      comment: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await postComment({
        variables: {
          postId: data.post.id,
          parentPath,
          text: values.comment,
        },
      });
      if (setIsReplying) {
        setIsReplying(false);
      }
      formik.resetForm();
    },
  });

  const cancelReply = () => {
    formik.resetForm();
    if (isReplying !== undefined && setIsReplying) {
      setIsReplying(false);
    }
  };

  const formButtons = [];

  if (formik.touched.comment || isReplying) {
    const buttonsToPush = (
      <Box
        display="flex"
        justifyContent="flex-end"
        key={`postComment-Button-${parentPath}`}
      >
        <StyledButtonWrapper>
          <Button onClick={() => cancelReply()} fullWidth>
            Cancel
          </Button>
        </StyledButtonWrapper>
        <StyledButtonWrapper>
          <Button
            fullWidth
            color="primary"
            variant="contained"
            type="submit"
            disabled={formik.isSubmitting || !formik.values.comment}
          >
            {parentPath === "/" ? "Comment" : "Reply"}
          </Button>
          {formik.isSubmitting && <StyledSubmitProgress size={24} />}
        </StyledButtonWrapper>
      </Box>
    );
    formButtons.push(buttonsToPush);
  }

  if (!isReplying) {
    return null;
  }

  return (
    <StyledForm
      onSubmit={formik.handleSubmit}
      parentPath={parentPath}
      key={`postComment-${parentPath}`}
    >
      <StyledTextField
        id="comment"
        name="comment"
        placeholder="Add a comment..."
        value={formik.values.comment}
        onChange={formik.handleChange}
        onFocusCapture={() => formik.setFieldTouched("comment", true)}
        error={formik.touched.comment && Boolean(formik.errors.comment)}
        helperText={formik.touched.comment && formik.errors.comment}
      />
      {formButtons}
    </StyledForm>
  );
};

export default PostComment;
