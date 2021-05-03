import { ApolloClient, InMemoryCache } from "@apollo/client";
import { NextPageContext } from "next";
import { withApollo } from "next-apollo";
import { PaginatedPosts } from "../graphql/generated/graphql";
import { isServerSide } from "../utils/isServerSide";

const client = (ctx: NextPageContext) =>
  new ApolloClient({
    connectToDevTools: true,
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
          },
        },
        PaginatedComments: {
          fields: {
            hasMore: {
              keyArgs: [],
              merge(_existing = false, incoming) {
                return incoming;
              },
            },
            result: {
              keyArgs: [],
              merge(existing = [], incoming) {
                if (incoming.length > existing?.length) {
                  return incoming;
                }
                return [...existing, ...incoming];
              },
            },
          },
        },
      },
    }),
  });

export default withApollo(client);
