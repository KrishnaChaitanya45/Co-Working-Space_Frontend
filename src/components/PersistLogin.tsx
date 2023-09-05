"use client";

import useRefreshToken from "@/hooks/useRefreshToken";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useState, useEffect } from "react";

const persistLogin = ({ children }: { children: any }) => {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const auth = useAppSelector((state) => state.auth.auth);
  const dispatch = useAppDispatch();
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
  useEffect(() => {
    console.log("IS LOADING", isLoading);
    console.log("AUTH", auth);
  }, [isLoading]);
  return <>{isLoading ? <p>Loading..!</p> : children}</>;
};

export default persistLogin;
