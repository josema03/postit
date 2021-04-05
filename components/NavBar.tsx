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
import { useLogoutMutation, useMeQuery } from "../src/generated/graphql";
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
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({ pause: isServerSide() });

  let userInterface = (
    <>
      <CircularProgress color="secondary" />
    </>
  );

  if (!isServerSide() && !fetching && !data?.me) {
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
  } else if (!isServerSide() && !fetching && data.me.username) {
    userInterface = (
      <>
        <Button>
          <StyledTypography>{data.me.username}</StyledTypography>
        </Button>
        <StyledWrapper>
          <Button onClick={() => logout()} disabled={logoutFetching}>
            <StyledTypography>Logout</StyledTypography>
          </Button>
          {logoutFetching && <StyledLogoutLoading />}
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
