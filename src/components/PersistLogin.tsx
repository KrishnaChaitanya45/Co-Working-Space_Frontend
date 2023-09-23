"use client";

import useRefreshToken from "@/hooks/useRefreshToken";
import { useAppDispatch, AppSelector } from "@/redux/hooks";
import { useState, useEffect } from "react";

const persistLogin = ({ children }: { children: any }) => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const auth = AppSelector((state) => state.auth.auth) as any;
  const dispatch = useAppDispatch();
  //@ts-ignore
  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (!auth?.accessToken) {
      verifyRefreshToken();
    } else {
      isMounted && setIsLoading(false);
    }
    return () => (isMounted = false);
  }, []);
  return <>{isLoading ? <div>Loading</div> : <div>{children}</div>}</>;
};

export default persistLogin;
