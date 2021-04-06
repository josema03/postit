import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { NextUrqlClientConfig, withUrqlClient } from "next-urql";
import Link from "next/link";
import React from "react";
import Layout from "../components/Layout";
import { usePostsQuery } from "../src/generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";

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
      return <p key={`${post.id}`}>{post.title}</p>;
    });
  }
  if (!data?.posts?.length && !fetching) {
    posts = <p>No posts found</p>;
  }

  return (
    <Layout>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          QLQ
        </Typography>
        <Link href="/create-post">Create Post</Link>
        {posts}
      </Box>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient as NextUrqlClientConfig, {
  ssr: true,
})(Index);
