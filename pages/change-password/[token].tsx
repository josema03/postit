/* eslint-disable react/prop-types */
import { CircularProgress, TextField, Button } from "@material-ui/core";
import * as yup from "yup";
import { useFormik } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import { useChangePasswordMutation } from "../../src/generated/graphql";
import { toErrorMap } from "../../utils/utils";
import { NextUrqlClientConfig, withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";

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
  newPassword: yup.string(),
});

const ChangePassword: NextPage<{ token: string }> = ({ token }) => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      newPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setErrors }) => {
      const response = await changePassword({
        newPassword: values.newPassword,
        token,
      });
      console.log(response);
      if (response.data?.changePassword.errors) {
        const errors = toErrorMap(response.data.changePassword.errors);
        if (!errors.token) {
          setErrors(errors);
        } else {
          setErrors({ newPassword: errors.token });
        }
      } else if (response.data?.changePassword.user) {
        router.push("/");
      }
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <TextField
          fullWidth
          id="newPassword"
          name="newPassword"
          label="New Password"
          type="password"
          value={formik.values.newPassword}
          onChange={formik.handleChange}
          error={
            formik.touched.newPassword && Boolean(formik.errors.newPassword)
          }
          helperText={formik.touched.newPassword && formik.errors.newPassword}
        />
        <StyledWrapper>
          <Button
            color="primary"
            variant="contained"
            fullWidth
            type="submit"
            disabled={formik.isSubmitting}
          >
            Change Password
          </Button>
          {formik.isSubmitting && <StyledSubmitProgress size={24} />}
        </StyledWrapper>
      </form>
    </div>
  );
};

ChangePassword.getInitialProps = async ({ query }) => {
  return {
    token: query.token as string,
  };
};

export default withUrqlClient(createUrqlClient as NextUrqlClientConfig)(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ChangePassword as any
);
