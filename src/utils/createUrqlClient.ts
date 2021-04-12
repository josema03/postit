/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ClientOptions,
  dedupExchange,
  Exchange,
  fetchExchange,
  gql,
  stringifyVariables,
} from "urql";
import { cacheExchange } from "@urql/exchange-graphcache";
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  LogoutMutation,
  RegisterMutation,
  VoteMutationVariables,
  DeletePostMutationVariables,
  UpdatePostMutationVariables,
} from "../graphql/generated/graphql";
import { betterUpdateQuery } from "./betterUpdateQuery";
import { isServerSide } from "./isServerSide";
import { invalidatePostsQueries } from "./invalidatePostsQueries";

const cursorPagination = () => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const newFieldKey = `${fieldName}(${stringifyVariables(fieldArgs)})`;
    const checkKey = cache.resolveFieldByKey(entityKey, newFieldKey);
    const isItInTheCache = cache.resolve(checkKey, "posts");
    info.partial = !isItInTheCache;
    const result = [];
    let hasMore = true;
    fieldInfos.forEach((fieldInfo) => {
      const key = cache.resolveFieldByKey(
        entityKey,
        fieldInfo.fieldKey
      ) as string[];
      const data = cache.resolve(key, "posts");
      const _hasMore = cache.resolve(key, "hasMore") as boolean;
      if (!_hasMore) {
        hasMore = _hasMore;
      }
      result.push(...data);
    });
    return { __typename: "PaginatedPosts", posts: result, hasMore };
  };
};

export const createUrqlClient = (
  ssrExchange: Exchange,
  ctx: any
): ClientOptions => {
  let cookie = "";
  if (isServerSide() && ctx) {
    cookie = ctx.req.headers.cookie;
  }

  return {
    url: "http://localhost:4000/graphql",
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie ? { cookie } : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          PaginatedPosts: () => null,
        },
        resolvers: {
          Query: {
            posts: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            deletePost: (_result, args, cache, _info) => {
              const { id } = args as DeletePostMutationVariables;
              cache.invalidate({ __typename: "Post", id: id });
            },
            vote: (_result, args, cache, _info) => {
              const { postId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment getData on Post {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: postId }
              );
              if (data && data.voteStatus !== value) {
                const newPoints = !data.voteStatus
                  ? data.points + value
                  : data.points + 2 * value;
                const newVoteStatus = value;
                cache.writeFragment(
                  gql`
                    fragment updateData on Post {
                      points
                      voteStatus
                    }
                  `,
                  { id: postId, points: newPoints, voteStatus: newVoteStatus }
                );
              }
            },
            createPost: (_result, _args, cache, _info) => {
              invalidatePostsQueries(cache);
            },
            updatePost: (_result, args, cache, _info) => {
              const { id } = args as UpdatePostMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment getData on Post {
                    title
                    text
                    textSnippet
                  }
                `,
                { id }
              );
              if (data) {
                const newTitle = args.title;
                const newText = args.text;
                const newTextSnippet = (args.text as string).slice(0, 50);
                cache.writeFragment(
                  gql`
                    fragment updateData on Post {
                      title
                      text
                      textSnippet
                    }
                  `,
                  {
                    id,
                    title: newTitle,
                    text: newText,
                    textSnippet: newTextSnippet,
                  }
                );
              }
            },
            login: (result, _args, cache, _info) => {
              invalidatePostsQueries(cache);
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                result,
                (r, q) => {
                  if (r.login.errors) {
                    return q;
                  } else {
                    return {
                      me: r.login.user,
                    };
                  }
                }
              );
            },
            logout: (result, _args, cache, _info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                result,
                (r, _q) => {
                  if (r.logout) {
                    return {
                      me: null,
                    };
                  }
                }
              );
            },
            register: (result, _args, cache, _info) => {
              invalidatePostsQueries(cache);
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                result,
                (r, q) => {
                  if (r.register.errors) {
                    return q;
                  } else {
                    return {
                      me: r.register.user,
                    };
                  }
                }
              );
            },
          },
        },
      }),
      ssrExchange,
      fetchExchange,
    ],
  };
};
