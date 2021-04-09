import { Cache } from "@urql/exchange-graphcache";

export const invalidatePostsQueries = (cache: Cache): void => {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === "posts");
  fieldInfos.forEach((fieldInfo) => {
    cache.invalidate("Query", "posts", fieldInfo.arguments || {});
  });
};
