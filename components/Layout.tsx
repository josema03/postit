/* eslint-disable react/prop-types */
import React from "react";
import NavBar from "./NavBar";
import styled from "styled-components";
import { Container } from "@material-ui/core";

const StyledContainer = styled(Container).attrs(() => ({
  maxWidth: "sm",
}))`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 12px;
`;

const Layout: React.FC<unknown> = ({ children }) => {
  return (
    <>
      <NavBar />
      <StyledContainer>{children}</StyledContainer>
    </>
  );
};

export default Layout;
