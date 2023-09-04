import { axiosPrivate } from "@/api/axios";
import { useEffect } from "react";

import useRefreshToken from "./useRefreshToken";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  //@ts-ignore

  useEffect(() => {
    const requestInterceptors = axiosPrivate.interceptors.request.use(
      (request) => {
        if (!request.headers.Authorization) {
          request.headers.Authorization = `Bearer ${auth.accessToken}`;
        }
        return request;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const resultInterceptors = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 403 && !prevRequest._retry) {
          prevRequest._retry = true;
          const accessToken = await refresh();
          prevRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          return axiosPrivate(prevRequest);
        } else {
          return Promise.reject(error);
        }
      }
    );

    return () => {
      axiosPrivate.interceptors.response.eject(resultInterceptors);
      axiosPrivate.interceptors.request.eject(requestInterceptors);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
