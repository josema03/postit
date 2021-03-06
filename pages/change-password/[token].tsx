/* eslint-disable react/prop-types */
import { Button, CircularProgress, TextField } from "@material-ui/core";
import { useFormik } from "formik";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import * as yup from "yup";
import Layout from "../../src/components/Layout";
import withApollo from "../../src/components/withApollo";
import {
  MeDocument,
  useChangePasswordMutation,
} from "../../src/graphql/generated/graphql";
import { toErrorMap } from "../../src/utils/utils";

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

const StyledTextField = styled(TextField).attrs(() => ({
  fullWidth: true,
  variant: "outlined",
  size: "small",
}))`
  margin-bottom: 12px;
`;

const validationSchema = yup.object({
  newPassword: yup.string(),
});

const ChangePassword: React.FC = () => {
  const [changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const formik = useFormik({
    initialValues: {
      newPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values, { setErrors }) => {
      const response = await changePassword({
        variables: {
          newPassword: values.newPassword,
          token:
            typeof router.query.token === "string" ? router.query.token : "",
        },
        update: (cache, { data }) => {
          cache.writeQuery({
            query: MeDocument,
            data: {
              __typename: "Query",
              me: data?.changePassword.user,
            },
          });
          cache.evict({ fieldName: "posts:{}" });
        },
      });
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
    <Layout>
      <StyledForm onSubmit={formik.handleSubmit}>
        <StyledTextField
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
      </StyledForm>
    </Layout>
  );
};

export default withApollo({ ssr: false })(ChangePassword);
