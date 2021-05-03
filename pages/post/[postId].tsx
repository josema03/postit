import {
  Box,
  Card,
  CircularProgress,
  Divider,
  Typography,
} from "@material-ui/core";
import React from "react";
import styled from "styled-components";
import CommentsSection from "../../src/components/CommentsSection";
import Layout from "../../src/components/Layout";
import PostComment from "../../src/components/PostComments";
import PostToolbar from "../../src/components/PostToolbar";
import withApollo from "../../src/components/withApollo";
import useGetPostFromRoute from "../../src/utils/useGetPostFromRoute";

const StyledCard = styled(Card)`
  display: flex;
  width: 100%;
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
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 10px 10px 5px 10px;
`;

const StyledCardBody = styled.div`
  display: block;
  padding: 5px 10px 10px 10px;
`;

const Post: React.FC = () => {
  const { data, loading } = useGetPostFromRoute();

  if (loading) {
    return (
      <Layout>
        <CircularProgress />
      </Layout>
    );
  }

  if (!data?.post && !loading) {
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
            <Box>
              <Typography variant="h4">{data.post.title}</Typography>
              <Typography variant="subtitle1" color="textSecondary">
                By {`${data.post.creator.username} at ${data.post.createdAt}`}
              </Typography>
            </Box>
            <PostToolbar post={data.post} />
          </StyledCardHeader>
          <StyledCardBody>
            <Typography variant="body1">{data.post.text}</Typography>
          </StyledCardBody>
          <Divider variant="middle" />
          <PostComment parentPath="/" />
          <CommentsSection />
        </StyledCardContent>
      </StyledCard>
    </Layout>
  );
};

export default withApollo({ ssr: true })(Post);
