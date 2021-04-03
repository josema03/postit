import React from "react";
import * as yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useFormik } from "formik";
import styled from "styled-components";
import { CircularProgress, Container } from "@material-ui/core";
import { useLoginMutation } from "../src/generated/graphql";
import { toErrorMap } from "../utils/utils";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { NextUrqlClientConfig, withUrqlClient } from "next-urql";
import Link from "next/link";

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

const StyledForgotPasswordWrapper = styled.div`
  text-align: right;
  margin-bottom: 12px;
`;

const StyledSubmitProgress = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`;

const StyledContainer = styled(Container).attrs(() => ({
  maxWidth: "sm",
}))`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px;
`;

const validationSchema = yup.object({
  username: yup.string(),
  password: yup.string(),
});

const Login: React.FC = () => {
  const [, login] = useLoginMutation();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      usernameOrEmail: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setErrors }) => {
      const response = await login(values);
      if (response.data?.login.errors) {
        setErrors(toErrorMap(response.data.login.errors));
      } else if (response.data?.login.user) {
        router.push("/");
      }
    },
  });

  return (
    <StyledContainer>
      <form onSubmit={formik.handleSubmit}>
        <StyledTextField
          id="usernameOrEmail"
          name="usernameOrEmail"
          label="Username or Email"
          value={formik.values.usernameOrEmail}
          onChange={formik.handleChange}
          error={
            formik.touched.usernameOrEmail &&
            Boolean(formik.errors.usernameOrEmail)
          }
          helperText={
            formik.touched.usernameOrEmail && formik.errors.usernameOrEmail
          }
        />
        <StyledTextField
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <StyledForgotPasswordWrapper>
          <Link href="/forgot-password">Forgot password?</Link>
        </StyledForgotPasswordWrapper>
        <StyledWrapper>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={formik.isSubmitting}
          >
            Log in
          </Button>
          {formik.isSubmitting && <StyledSubmitProgress size={24} />}
        </StyledWrapper>
      </form>
    </StyledContainer>
  );
};

export default withUrqlClient(createUrqlClient as NextUrqlClientConfig, {
  ssr: false,
})(Login);
