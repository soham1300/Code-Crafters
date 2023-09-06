import React from "react";
import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../App";
import styled from "styled-components";

function Search() {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <SearchDiv>
      <SearchInput isDarkMode={isDarkMode}></SearchInput>
    </SearchDiv>
  );
}

export default Search;

const SearchDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const SearchInput = styled.input.attrs({
  type: "text",
  placeholder: "Search",
})`
  width: 81vw;
  height: 5vh;
  padding-left: 1vw;
  margin-top: 1vw;
  font-size: 20px;
  /* border-bottom: #cccccc; */
  border: none;
  background-color: transparent;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  &:focus {
    outline: none;
    border: none;
  }
`;
