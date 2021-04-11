import { CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useFormik } from "formik";
import { NextUrqlClientConfig, withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import * as yup from "yup";
import Layout from "../src/components/Layout";
import { useCreatePostMutation } from "../src/graphql/generated/graphql";
import { createUrqlClient } from "../src/utils/createUrqlClient";
import { useIsAuth } from "../src/utils/useIsAuth";

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

const CreatePost: React.FC = () => {
  const router = useRouter();
  const [, createPost] = useCreatePostMutation();
  const formik = useFormik({
    initialValues: {
      title: "",
      text: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await createPost({ postInput: values });
      router.push("/");
    },
  });

  useIsAuth();

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
            Create Post
          </Button>
          {formik.isSubmitting && <StyledSubmitProgress size={24} />}
        </StyledWrapper>
      </StyledForm>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient as NextUrqlClientConfig)(
  CreatePost
);
