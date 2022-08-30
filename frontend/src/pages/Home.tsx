import React, { useCallback } from "react";
import { useAxios } from "../hooks/useAxios";

export const Home = () => {
  const axiosClient = useAxios();
  const handleClick = useCallback(async () => {
    try {
      const response = await axiosClient.get("/api/test");
      console.log(response.data);
    } catch (e) {}
  }, []);
  return (
    <div>
      <button onClick={handleClick}>Request</button>
    </div>
  );
};
