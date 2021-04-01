import React from "react";
import * as yup from "yup";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import { useFormik } from "formik";
import styled from "styled-components";
import { CircularProgress } from "@material-ui/core";
import { useLoginMutation } from "../src/generated/graphql";
import { toErrorMap } from "../utils/utils";
import { useRouter } from "next/router";
import { createUrqlClient } from "../utils/createUrqlClient";
import { NextUrqlClientConfig, withUrqlClient } from "next-urql";

const StyledWrapper = styled.div`
  position: relative;
`;

const StyledSubmitProgress = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
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
      username: "",
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
    <div>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="username"
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <TextField
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
            Log in
          </Button>
          {formik.isSubmitting && <StyledSubmitProgress size={24} />}
        </StyledWrapper>
      </form>
    </div>
  );
};

export default withUrqlClient(createUrqlClient as NextUrqlClientConfig, {
  ssr: false,
})(Login);
