import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { NextUrqlClientConfig, withUrqlClient } from "next-urql";
import React from "react";
import Layout from "../components/Layout";
import { createUrqlClient } from "../utils/createUrqlClient";

function Index(): React.ReactElement {
  return (
    <Layout>
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          QLQ Menol
        </Typography>
      </Box>
    </Layout>
  );
}

export default withUrqlClient(createUrqlClient as NextUrqlClientConfig, {
  ssr: true,
})(Index);
