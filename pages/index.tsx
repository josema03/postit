import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import NavBar from "../components/NavBar";

export default function Index(): React.ReactElement {
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
