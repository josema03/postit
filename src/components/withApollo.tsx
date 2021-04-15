import { withApollo } from "next-apollo";
import { ApolloClient, InMemoryCache } from "@apollo/client";
import {
  PaginatedComments,
  PaginatedPosts,
} from "../graphql/generated/graphql";
import { NextPageContext } from "next";
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
                exisingCommentsQuery: PaginatedComments | undefined,
                incomingCommentsQuery: PaginatedComments
              ): PaginatedComments {
                return {
                  ...incomingCommentsQuery,
                  result: [
                    ...(exisingCommentsQuery?.result || []),
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
