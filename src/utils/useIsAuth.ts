import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../graphql/generated/graphql";

export const useIsAuth = (): void => {
  const [{ data, fetching }] = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (!fetching && !data?.me) {
      router.replace("/login?next=" + router.asPath || router.pathname);
    }
  }, [fetching, data, router]);
};
