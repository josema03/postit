/* eslint-disable react/prop-types */
import React from "react";
import NavBar from "./NavBar";
import styled from "styled-components";

const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  min-width: 100%;
  max-width: 100%;
  padding: 0px;
  margin: 0px;
  overflow: auto;
`;

const StyledContent = styled.div`
  display: flex;
  flex-grow: 1;
  max-width: 100%;
  align-items: center;
  justify-content: center;
`;

const StyledMain = styled.main`
  display: flex;
  margin: 10px 0px;
  min-width: 75%;
  max-width: 75%;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

const Layout: React.FC<unknown> = ({ children }) => {
  return (
    <StyledBody>
      <NavBar />
      <StyledContent>
        <StyledMain>{children}</StyledMain>
      </StyledContent>
    </StyledBody>
  );
};

export default Layout;
