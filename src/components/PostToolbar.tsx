import { Box, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { useRouter } from "next/router";
import React from "react";
import {
  Post,
  PostSnippetFragment,
  useDeletePostMutation,
  useMeQuery,
} from "../graphql/generated/graphql";

interface PostToolbarProps {
  post: PostSnippetFragment | Post;
}

const PostToolbar: React.FC<PostToolbarProps> = ({ post }) => {
  const router = useRouter();
  const { data } = useMeQuery();
  const [deletePost] = useDeletePostMutation();

  const deletePostAndGoHome = async () => {
    await router.push("/");
    deletePost({
      variables: { id: post.id },
      update: (cache) => {
        cache.evict({ id: "Post:" + String(post.id) });
      },
    });
  };

  if (post.creator.id === data?.me?.id) {
    return (
      <Box display="flex" flex="0 0">
        <IconButton
          size="small"
          onClick={() => router.push(`/post/edit/${post.id}`)}
        >
          <EditIcon fontSize={"small"} />
        </IconButton>
        <IconButton size="small" onClick={() => deletePostAndGoHome()}>
          <DeleteIcon fontSize={"small"} />
        </IconButton>
      </Box>
    );
  }

  return null;
};

export default PostToolbar;
