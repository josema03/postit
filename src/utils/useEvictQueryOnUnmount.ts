import { useApolloClient } from "@apollo/client";
import { useEffect } from "react";

const useEvictQueryOnUnmount = (evictObject: {
  id: string;
  fieldName?: string;
}): ReturnType<typeof useEffect> => {
  const apolloClient = useApolloClient();
  useEffect(() => {
    return () => {
      apolloClient.cache.evict(evictObject);
      apolloClient.cache.gc();
    };
  }, []);
};

export default useEvictQueryOnUnmount;
