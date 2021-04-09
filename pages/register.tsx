import React from "react";
import * as yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useFormik } from "formik";
import styled from "styled-components";
import { CircularProgress } from "@material-ui/core";
import { useRegisterMutation } from "../src/graphql/generated/graphql";
import { toErrorMap } from "../src/utils/utils";
import { useRouter } from "next/router";
import { createUrqlClient } from "../src/utils/createUrqlClient";
import { NextUrqlClientConfig, withUrqlClient } from "next-urql";
import Layout from "../src/components/Layout";

const StyledTextField = styled(TextField).attrs(() => ({
  fullWidth: true,
  variant: "outlined",
  size: "small",
}))`
  margin-bottom: 12px;
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

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const validationSchema = yup.object({
  username: yup.string(),
  email: yup.string(),
  password: yup.string(),
});

const Register: React.FC = () => {
  const [, register] = useRegisterMutation();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setErrors }) => {
      const response = await register(values);
      if (response.data?.register.errors) {
        setErrors(toErrorMap(response.data.register.errors));
      } else if (response.data?.register.user) {
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
        <StyledTextField
          id="username"
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <StyledTextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <StyledWrapper>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={formik.isSubmitting}
          >
            Register
          </Button>
          {formik.isSubmitting && <StyledSubmitProgress size={24} />}
        </StyledWrapper>
      </StyledForm>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient as NextUrqlClientConfig, {
  ssr: false,
})(Register);
