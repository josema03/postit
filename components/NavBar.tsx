import {
  AppBar,
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

const StyledLogoutLoading = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -12px;
  margin-left: -12px;
`;

const NavBar: React.FunctionComponent = (): React.ReactElement => {
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();
  const [{ data, fetching }] = useMeQuery({ pause: isServerSide() });

  let userInterface = null;

  if (fetching) {
    userInterface = (
      <>
        <CircularProgress />
      </>
    );
  } else if (!data?.me) {
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
  } else if (data.me.username) {
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
      <Toolbar>{userInterface}</Toolbar>
    </AppBar>
  );
};

export default NavBar;
