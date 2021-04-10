/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box, IconButton } from "@material-ui/core";
import React from "react";
import {
  PostSnippetFragment,
  useDeletePostMutation,
  useMeQuery,
} from "../graphql/generated/graphql";
import DeleteIcon from "@material-ui/icons/Delete";

interface PostToolbarProps {
  post: PostSnippetFragment;
}

const PostToolbar: React.FC<PostToolbarProps> = ({ post }) => {
  const [{ data }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();

  if (post.creator.id === data?.me?.id) {
    return (
      <Box>
        <IconButton size="small" onClick={() => deletePost({ id: post.id })}>
          <DeleteIcon fontSize={"small"} />
        </IconButton>
      </Box>
    );
  }

  return null;
};

export default PostToolbar;
