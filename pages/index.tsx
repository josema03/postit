import { Button, Card, CircularProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { NextUrqlClientConfig, withUrqlClient } from "next-urql";
import Link from "next/link";
import React, { useState } from "react";
import styled from "styled-components";
import { CardVote } from "../components/CardVote";
import Layout from "../components/Layout";
import { usePostsQuery } from "../src/generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

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

const StyledBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledCardHeader = styled.div`
  display: block;
  padding: 2px;
`;

const StyledCardBody = styled.div`
  display: block;
  padding: 5px 2px;
`;

function Index(): React.ReactElement {
  const [variables, setVariables] = useState({
    cursor: null,
    limit: 10,
  });
  const [{ data, fetching }] = usePostsQuery({
    variables,
  });

  let posts: JSX.Element | JSX.Element[] = <CircularProgress />;
  if (data?.posts?.posts?.length) {
    posts = data.posts.posts.map((post) => {
      return (
        <StyledCard key={`${post.id}`}>
          <CardVote post={post} />
          <StyledCardContent>
            <StyledCardHeader>
              <Typography variant="h6">{post.title}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                By {`${post.creator.username} at ${post.createdAt}`}
              </Typography>
            </StyledCardHeader>
            <StyledCardBody>
              <Typography variant="body1">{post.textSnippet}...</Typography>
            </StyledCardBody>
          </StyledCardContent>
        </StyledCard>
      );
    });
  }
  if (!data?.posts?.posts?.length && !fetching) {
    posts = <p>No posts found</p>;
  }

  const changeVariables = () => {
    const cursor = data.posts.posts[data.posts.posts.length - 1].id || null;
    const limit = variables.limit;
    setVariables({ limit, cursor: String(cursor) });
  };

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
        {!fetching && data?.posts?.hasMore && (
          <Box display="flex" justifyContent="center">
            <Button color="primary" onClick={() => changeVariables()}>
              Load more...
            </Button>
          </Box>
        )}
      </Box>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient as NextUrqlClientConfig, {
  ssr: true,
})(Index);
