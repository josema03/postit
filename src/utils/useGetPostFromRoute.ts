import { useRouter } from "next/router";
import { usePostQuery } from "../graphql/generated/graphql";

const useGetPostFromRoute = (): ReturnType<typeof usePostQuery> => {
  const router = useRouter();
  const { postId: postIdString } = router.query;
  const postId = parseInt(postIdString as string);
  return usePostQuery({
    variables: { id: postId },
    skip: typeof postId !== "number",
  });
};

export default useGetPostFromRoute;
