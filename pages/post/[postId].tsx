import { Card, CircularProgress, Typography } from "@material-ui/core";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import styled from "styled-components";
import Layout from "../../src/components/Layout";
import { usePostQuery } from "../../src/graphql/generated/graphql";
import { createUrqlClient } from "../../src/utils/createUrqlClient";

const StyledCard = styled(Card)`
  display: flex;
  margin: 20px 10px;
  padding: 0px;
  box-shadow: 0px 0px 5px 0px black;
`;

const StyledCardContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1;
`;

const StyledCardHeader = styled.div`
  display: block;
  padding: 10px 10px 5px 10px;
`;

const StyledCardBody = styled.div`
  display: block;
  padding: 5px 10px 10px 10px;
`;

const Post: React.FC = () => {
  const router = useRouter();
  const { postId: postIdString } = router.query;
  const postId = parseInt(postIdString as string);
  const [{ data, fetching }] = usePostQuery({
    variables: { id: postId },
    pause: typeof postId !== "number",
  });

  if (fetching) {
    return (
      <Layout>
        <CircularProgress />
      </Layout>
    );
  }

  if (!data?.post && !fetching) {
    return (
      <Layout>
        <StyledCard>
          <StyledCardHeader>
            <Typography variant="h4">No post was found</Typography>
          </StyledCardHeader>
        </StyledCard>
      </Layout>
    );
  }

  return (
    <Layout>
      <StyledCard>
        <StyledCardContent>
          <StyledCardHeader>
            <Typography variant="h4">{data.post.title}</Typography>
          </StyledCardHeader>
          <StyledCardBody>
            <Typography variant="body1">{data.post.text}</Typography>
          </StyledCardBody>
        </StyledCardContent>
      </StyledCard>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: true })(Post);
