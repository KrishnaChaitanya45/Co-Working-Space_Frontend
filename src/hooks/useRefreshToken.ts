import { useAppDispatch } from "@/redux/hooks";
import axios from "../api/axios";
import { setAuth } from "@/redux/features/Auth";

const useRefreshToken = () => {
  //@ts-ignore
  const dispatch = useAppDispatch();
  const refresh = async () => {
    try {
      const response = await axios.get("/auth/refresh", {
        withCredentials: true,
      });
      dispatch(
        setAuth((prev: any) => {
          return { ...prev, accessToken: response.data.accessToken };
        })
      );
      return response.data.accessToken;
    } catch (error) {
      console.log(error);
    }
  };
  return refresh;
};

export default useRefreshToken;
