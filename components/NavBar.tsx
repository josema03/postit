import {
  AppBar,
  Button,
  CircularProgress,
  Toolbar,
  Typography,
} from "@material-ui/core";
import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";
import { useMeQuery } from "../src/generated/graphql";

const StyledTypography = styled(Typography).attrs(() => ({
  variant: "button",
}))`
  color: white;
`;

const NavBar: React.FunctionComponent = (): React.ReactElement => {
  const [{ data, fetching }] = useMeQuery();

  let userInterface = null;
  console.log(data, fetching);

  if (fetching) {
    userInterface = <CircularProgress />;
  } else if (!data.me) {
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
        <Button>
          <StyledTypography>Logout</StyledTypography>
        </Button>
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
