import { Button, CircularProgress, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import * as yup from "yup";
import Layout from "../src/components/Layout";
import withApollo from "../src/components/withApollo";
import { useForgotPasswordMutation } from "../src/graphql/generated/graphql";

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
  email: yup.string(),
});

const ForgotPassword: React.FC = () => {
  const [forgotPassword] = useForgotPasswordMutation();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await forgotPassword({ variables: values });
      if (response.data?.forgotPassword) {
        router.push("/");
      }
    },
  });

  return (
    <Layout>
      <StyledForm onSubmit={formik.handleSubmit}>
        <StyledTextField
          id="email"
          name="email"
          label="Email"
          value={formik.values.email}
          onChange={formik.handleChange}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
        />
        <StyledWrapper>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={formik.isSubmitting}
          >
            Send Email
          </Button>
          {formik.isSubmitting && <StyledSubmitProgress size={24} />}
        </StyledWrapper>
      </StyledForm>
    </Layout>
  );
};

export default withApollo({ ssr: false })(ForgotPassword);
