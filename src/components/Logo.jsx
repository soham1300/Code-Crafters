import React, { useContext } from "react";
import styled from "styled-components";
import LogoWhite from "../images/LogoWhite.png";
import LogoDark from "../images/LogoDark.png";
import { ThemeContext } from "../App";

function Logo() {
  const { isDarkMode } = useContext(ThemeContext);
  return <LogoImg alt="logo" src={isDarkMode ? LogoWhite : LogoDark} />;
}

export default Logo;

const LogoImg = styled.img`
  position: absolute;
  top: 5px;
  left: 5px;
  height: 5vh;
  z-index: 0;
`;
