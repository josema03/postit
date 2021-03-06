import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../graphql/generated/graphql";

export const useIsAuth = (): void => {
  const { data, loading } = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !data?.me) {
      router.replace("/login?next=" + router.asPath || router.pathname);
    }
  }, [loading, data, router]);
};
