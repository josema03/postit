import {
  Button,
  Card,
  CircularProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import * as yup from "yup";
import Layout from "../../../src/components/Layout";
import withApollo from "../../../src/components/withApollo";
import {
  useMeQuery,
  usePostQuery,
  useUpdatePostMutation,
} from "../../../src/graphql/generated/graphql";
import { useIsAuth } from "../../../src/utils/useIsAuth";

const StyledCard = styled(Card)`
  display: flex;
  margin: 20px 10px;
  padding: 0px;
  box-shadow: 0px 0px 5px 0px black;
`;

const StyledCardHeader = styled.div`
  display: block;
  padding: 10px 10px 5px 10px;
`;

const StyledWrapper = styled.div`
  position: relative;
  margin: auto;
  width: 50%;
`;

const StyledTextField = styled(TextField).attrs(() => ({
  fullWidth: true,
  variant: "outlined",
  size: "small",
}))`
  margin-bottom: 12px;
`;

const StyledSubmitProgress = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const validationSchema = yup.object({
  title: yup.string().required("Post must have a title"),
  text: yup.string().required("Post cannot be empty"),
});

const EditPost = () => {
  const router = useRouter();
  const { postId: postIdString } = router.query;
  const postId =
    typeof postIdString === "string" ? parseInt(postIdString) : undefined;
  const { data, loading } = usePostQuery({
    variables: { id: postId },
    skip: typeof postId !== "number",
  });
  const [isQuerySent, setIsQuerySent] = useState(false);

  const { data: meData, loading: meLoading } = useMeQuery();

  const [updatePost] = useUpdatePostMutation();

  const formik = useFormik({
    initialValues: {
      title: "",
      text: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await updatePost({
        variables: { id: postId, title: values.title, text: values.text },
      });
      router.push("/");
    },
  });

  useIsAuth();

  useEffect(() => {
    if (data?.post) {
      formik.initialValues.title = data.post.title;
      formik.initialValues.text = data.post.text;
      formik.resetForm();
    }
  }, [data]);

  useEffect(() => {
    if (loading || data?.post) {
      setIsQuerySent(true);
    }
  }, [loading]);

  if (loading || !isQuerySent || meLoading) {
    return (
      <Layout>
        <CircularProgress />
      </Layout>
    );
  }

  if (!data?.post && !loading) {
    return (
      <Layout>
        <StyledCard>
          <StyledCardHeader>
            <Typography variant="h4">No post was found</Typography>
          </StyledCardHeader>
        </StyledCard>
      </Layout>
    );
  }

  if (meData.me?.id !== data.post.creator.id) {
    return (
      <Layout>
        <StyledCard>
          <StyledCardHeader>
            <Typography variant="h4">You cannot edit this post</Typography>
          </StyledCardHeader>
        </StyledCard>
      </Layout>
    );
  }

  return (
    <Layout>
      <StyledForm onSubmit={formik.handleSubmit}>
        <StyledTextField
          id="title"
          name="title"
          label="Title"
          value={formik.values.title}
          onChange={formik.handleChange}
          error={formik.touched.title && Boolean(formik.errors.title)}
          helperText={formik.touched.title && formik.errors.title}
        />
        <StyledTextField
          id="text"
          name="text"
          label="Text"
          multiline
          rows={10}
          value={formik.values.text}
          onChange={formik.handleChange}
          error={formik.touched.text && Boolean(formik.errors.text)}
          helperText={formik.touched.text && formik.errors.text}
        />
        <StyledWrapper>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={formik.isSubmitting}
          >
            Edit Post
          </Button>
          {formik.isSubmitting && <StyledSubmitProgress size={24} />}
        </StyledWrapper>
      </StyledForm>
    </Layout>
  );
};

export default withApollo({ ssr: false })(EditPost);
