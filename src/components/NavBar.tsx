import { useApolloClient } from "@apollo/client";
import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { useLogoutMutation, useMeQuery } from "../graphql/generated/graphql";
import { isServerSide } from "../utils/isServerSide";
const StyledTypography = styled(Typography).attrs(() => ({
  variant: "button",
}))`
  color: white;
`;

const StyledWrapper = styled.div`
  position: relative;
`;

const StyledLogoutLoading = styled(CircularProgress).attrs(() => ({
  color: "secondary",
}))`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`;

const StyledToolbar = styled(Toolbar)`
  display: flex;
  justify-content: space-between;
`;

const NavBar: React.FunctionComponent = (): React.ReactElement => {
  const apolloClient = useApolloClient();
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const { data, loading } = useMeQuery({ skip: isServerSide() });

  const logoutAndGoHome = async () => {
    await logout();
    await apolloClient.resetStore();
  };

  let userInterface = (
    <>
      <CircularProgress color="secondary" />
    </>
  );

  if (!isServerSide() && !loading && !data?.me) {
    userInterface = (
      <>
        <Link href="/login">
          <Button>
            <StyledTypography>Login</StyledTypography>
          </Button>
        </Link>
        <Link href="/register">
          <Button>
            <StyledTypography>Register</StyledTypography>
          </Button>
        </Link>
      </>
    );
  } else if (!isServerSide() && !loading && data.me.username) {
    userInterface = (
      <>
        <Button>
          <StyledTypography>{data.me.username}</StyledTypography>
        </Button>
        <Link href="/create-post">
          <Button>
            <StyledTypography>New Post</StyledTypography>
          </Button>
        </Link>
        <StyledWrapper>
          <Button onClick={() => logoutAndGoHome()} disabled={logoutLoading}>
            <StyledTypography>Logout</StyledTypography>
          </Button>
          {logoutLoading && <StyledLogoutLoading />}
        </StyledWrapper>
      </>
    );
  }

  return (
    <AppBar position="static">
      <StyledToolbar>
        <Box display="flex">
          <Link href="/">
            <Button>
              <StyledTypography>Home</StyledTypography>
            </Button>
          </Link>
        </Box>
        <Box display="flex">{userInterface}</Box>
      </StyledToolbar>
    </AppBar>
  );
};

export default NavBar;
