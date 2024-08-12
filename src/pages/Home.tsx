import { useAppSelector } from "@/app/hooks";
import React from "react";

function Home() {
  const user = useAppSelector((state) => state.auth);
  const token = localStorage.getItem("token");
  const username = localStorage.getItem("username");

  return (
    <div className="bg-blue-500 min-h-screen flex items-center justify-center">
      <div className="text-white text-[20rem] font-thin italic">
        <h1>{username}</h1>
      </div>
    </div>
  );
}

export default Home;
