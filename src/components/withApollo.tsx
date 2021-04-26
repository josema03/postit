import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NextPageContext } from "next";
import { withApollo } from "next-apollo";
import {
  PaginatedComments,
  PaginatedPosts,
} from "../graphql/generated/graphql";
import { isServerSide } from "../utils/isServerSide";

const client = (ctx: NextPageContext) =>
  new ApolloClient({
    uri: "http://localhost:4000/graphql",
    credentials: "include",
    headers: {
      cookie: (isServerSide() ? ctx?.req?.headers.cookie : undefined) || "",
    },
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: [],
              merge(
                existing: PaginatedPosts | undefined,
                incoming: PaginatedPosts
              ): PaginatedPosts {
                return {
                  ...incoming,
                  posts: [...(existing?.posts || []), ...incoming.posts],
                };
              },
            },
            comments: {
              keyArgs: [],
              merge(
                existingCommentsQuery:
                  | (PaginatedComments & {
                      result: { __ref: string }[];
                    })
                  | undefined,
                incomingCommentsQuery: PaginatedComments & {
                  result: { __ref: string }[];
                }
              ): PaginatedComments {
                const topExistingCommentId = existingCommentsQuery?.result[0].__ref.replace(
                  /Comment:/,
                  ""
                );
                const topIncomingCommentId = incomingCommentsQuery.result[0].__ref.replace(
                  /Comment:/,
                  ""
                );
                if (
                  parseInt(topIncomingCommentId) >
                    parseInt(topExistingCommentId) &&
                  incomingCommentsQuery.result.length === 1
                ) {
                  return {
                    ...incomingCommentsQuery,
                    result: [
                      ...incomingCommentsQuery.result,
                      ...(existingCommentsQuery?.result || []),
                    ],
                  };
                }
                return {
                  ...incomingCommentsQuery,
                  result: [
                    ...(existingCommentsQuery?.result || []),
                    ...incomingCommentsQuery.result,
                  ],
                };
              },
            },
          },
        },
      },
    }),
  });

export default withApollo(client);
