import { Card, CardContent, CardHeader } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { NextUrqlClientConfig, withUrqlClient } from "next-urql";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import Layout from "../components/Layout";
import { usePostsQuery } from "../src/generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

const StyledCard = styled(Card)`
  margin: 10px;
  box-shadow: 0px 0px 5px 0px black;
`;

const StyledBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

function Index(): React.ReactElement {
  const [{ data, fetching }] = usePostsQuery({
    variables: {
      cursor: null,
      limit: 10,
    },
  });

  let posts: JSX.Element | JSX.Element[] = <p>loading...</p>;
  if (data?.posts.length) {
    posts = data.posts.map((post) => {
      return (
        <StyledCard key={`${post.id}`}>
          <CardHeader title={post.title} subheader="creator" />
          <CardContent>{post.textSnippet}...</CardContent>
        </StyledCard>
      );
    });
  }
  if (!data?.posts?.length && !fetching) {
    posts = <p>No posts found</p>;
  }

  return (
    <Layout>
      <Box>
        <StyledBox>
          <Typography variant="h4" component="h1" gutterBottom>
            QLQ
          </Typography>
          <Link href="/create-post">Create Post</Link>
        </StyledBox>
        {posts}
      </Box>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient as NextUrqlClientConfig, {
  ssr: true,
})(Index);
