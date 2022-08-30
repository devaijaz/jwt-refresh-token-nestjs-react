import { useEffect } from "react";
import { useRefreshToken } from "./useRefreshToken";

export const useSession = () => {
  const refresh = useRefreshToken();
  useEffect(() => {
    refresh();
  }, []);
  return null;
};
