import { Box, Button, CircularProgress, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import React from "react";
import styled from "styled-components";
import * as yup from "yup";
import useGetPostFromRoute from "../utils/useGetPostFromRoute";
import {
  CommentsDocument,
  CommentsQuery,
  CommentsQueryVariables,
  usePostCommentMutation,
} from "../graphql/generated/graphql";

const StyledForm = styled.form`
  display: flex;
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

const PostComment: React.FC = () => {
  const { data } = useGetPostFromRoute();
  const [postComment] = usePostCommentMutation({
    update: (cache, { data }) => {
      const previousQuery = cache.readQuery<
        CommentsQuery,
        CommentsQueryVariables
      >({
        query: CommentsDocument,
      });
      cache.writeQuery({
        query: CommentsDocument,
        data: {
          comments: {
            ...previousQuery.comments,
            result: [data.postComment],
          },
        },
      });
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
          parentPath: "/",
          text: values.comment,
        },
      });
      formik.resetForm();
    },
  });

  return (
    <StyledForm onSubmit={formik.handleSubmit}>
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
      {formik.touched.comment && (
        <Box display="flex" justifyContent="flex-end">
          <StyledButtonWrapper>
            <Button fullWidth>Cancel</Button>
          </StyledButtonWrapper>
          <StyledButtonWrapper>
            <Button
              fullWidth
              color="primary"
              variant="contained"
              type="submit"
              disabled={formik.isSubmitting || !formik.values.comment}
            >
              Comment
            </Button>
            {formik.isSubmitting && <StyledSubmitProgress size={24} />}
          </StyledButtonWrapper>
        </Box>
      )}
    </StyledForm>
  );
};

export default PostComment;
