import React from "react";
import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../App";

function Home() {
  // const { currentUser } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);

  return <p>Home</p>;
}

export default Home;
