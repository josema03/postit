import React from "react";
import styled from "styled-components";
import PostComment from "./PostComments";

const StyledCardBody = styled.div`
  display: block;
  padding: 10px;
`;

const CommentsSection: React.FC = () => {
  return (
    <StyledCardBody>
      <PostComment />
    </StyledCardBody>
  );
};

export default CommentsSection;
