import {
  TextField,
  CircularProgress,
  Container,
  Button,
} from "@material-ui/core";
import * as yup from "yup";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { useForgotPasswordMutation } from "../src/generated/graphql";
import { NextUrqlClientConfig, withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const StyledWrapper = styled.div`
  position: relative;
  margin: auto;
  width: 90%;
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

const StyledContainer = styled(Container).attrs(() => ({
  maxWidth: "sm",
}))`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  padding: 12px;
`;

const validationSchema = yup.object({
  email: yup.string(),
});

const ForgotPassword: React.FC = () => {
  const [, forgotPassword] = useForgotPasswordMutation();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const response = await forgotPassword(values);
      if (response.data?.forgotPassword) {
        router.push("/");
      }
    },
  });

  return (
    <StyledContainer>
      <form onSubmit={formik.handleSubmit}>
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
      </form>
    </StyledContainer>
  );
};

export default withUrqlClient(createUrqlClient as NextUrqlClientConfig)(
  ForgotPassword
);
