import { CircularProgress, IconButton, Typography } from "@material-ui/core";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import React, { useState } from "react";
import styled from "styled-components";
import {
  PostSnippetFragment,
  useVoteMutation,
} from "../graphql/generated/graphql";

const StyledCardVote = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  flex: 0 0;
  padding: 2px;
  margin-right: 4px;
`;

const StyledButtonWrapper = styled.div`
  position: relative;
`;

const StyledCircularProgress = styled(CircularProgress)`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

interface CardVoteProps {
  post: PostSnippetFragment;
}

export const CardVote: React.FC<CardVoteProps> = ({ post }) => {
  const [loading, setLoading] = useState<
    "like-loading" | "dislike-loading" | "no-loading"
  >("no-loading");
  const [, vote] = useVoteMutation();

  const voteLike = async (): Promise<void> => {
    setLoading("like-loading");
    await vote({
      value: 1,
      postId: post.id,
    });
    setLoading("no-loading");
  };

  const voteDislike = async (): Promise<void> => {
    setLoading("dislike-loading");
    await vote({
      value: -1,
      postId: post.id,
    });
    setLoading("no-loading");
  };

  return (
    <StyledCardVote>
      <StyledButtonWrapper>
        <IconButton
          size="small"
          color={post.voteStatus > 0 ? "primary" : "default"}
          arial-label="like"
          disabled={loading === "like-loading" || loading === "dislike-loading"}
          onClick={() => voteLike()}
        >
          <KeyboardArrowUpIcon />
        </IconButton>
        {loading === "like-loading" && <StyledCircularProgress size={30} />}
      </StyledButtonWrapper>
      <Typography variant="button" align="center">
        {post.points}
      </Typography>
      <StyledButtonWrapper>
        <IconButton
          size="small"
          color={post.voteStatus < 0 ? "secondary" : "default"}
          aria-label="dislike"
          disabled={loading === "like-loading" || loading === "dislike-loading"}
          onClick={() => voteDislike()}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
        {loading === "dislike-loading" && <StyledCircularProgress size={30} />}
      </StyledButtonWrapper>
    </StyledCardVote>
  );
};
