import { Button, Card, CircularProgress } from "@material-ui/core";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import dynamic from "next/dynamic";
import Link from "next/link";
import React from "react";
import styled from "styled-components";
import { CardVote } from "../src/components/CardVote";
import Layout from "../src/components/Layout";
import withApollo from "../src/components/withApollo";
import { usePostsQuery } from "../src/graphql/generated/graphql";

const PostToolbar = dynamic(() => import("../src/components/PostToolbar"), {
  ssr: false,
});

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
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 2px;
`;

const StyledCardBody = styled.div`
  display: block;
  padding: 5px 2px;
`;

const StyledTypography = styled(Typography)`
  cursor: pointer;

  &:hover {
    opacity: 0.7;
  }
`;

function Index(): React.ReactElement {
  const { data, loading, fetchMore, variables: queryVariables } = usePostsQuery(
    {
      variables: {
        cursor: null,
        limit: 10,
      },
    }
  );

  let posts: JSX.Element | JSX.Element[] = <CircularProgress />;
  if (data?.posts?.posts?.length) {
    posts = data.posts.posts.map((post) => {
      return !post ? null : (
        <StyledCard key={`${post.id}`}>
          <CardVote post={post} />
          <StyledCardContent>
            <StyledCardHeader>
              <Box>
                <Link href="post/[id]" as={`post/${post.id}`}>
                  <StyledTypography variant="h6">{post.title}</StyledTypography>
                </Link>
                <Typography variant="subtitle1" color="textSecondary">
                  By {`${post.creator.username} at ${post.createdAt}`}
                </Typography>
              </Box>
              <PostToolbar post={post} />
            </StyledCardHeader>
            <StyledCardBody>
              <Typography variant="body1">{post.textSnippet}...</Typography>
            </StyledCardBody>
          </StyledCardContent>
        </StyledCard>
      );
    });
  }
  if (!data?.posts?.posts?.length && !loading) {
    posts = <p>No posts found</p>;
  }

  const changeVariables = () => {
    const cursor = data.posts.posts[data.posts.posts.length - 1].id || null;
    const limit = queryVariables?.limit;
    fetchMore({
      variables: { limit, cursor: String(cursor) },
    });
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
        {!loading && data?.posts?.hasMore && (
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

export default withApollo({ ssr: true })(Index);
