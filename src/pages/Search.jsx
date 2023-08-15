import React from "react";
import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../App";

function Search() {
  const { isDarkMode } = useContext(ThemeContext);
  return <p>Search</p>;
}

export default Search;
