import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import NavBar from "../components/NavBar";
import { NextUrqlClientConfig, withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

function Index(): React.ReactElement {
  return (
    <>
      <NavBar />
      <Container maxWidth="sm">
        <Box my={4}>
          <Typography variant="h4" component="h1" gutterBottom>
            QLQ Menol
          </Typography>
        </Box>
      </Container>
    </>
  );
}

export default withUrqlClient(createUrqlClient as NextUrqlClientConfig, {
  ssr: true,
})(Index);
