import React, { useContext, useState } from "react";
import styled from "styled-components";
import { ThemeContext } from "../App";
import { TbBrandPython } from "react-icons/tb";
import { DiJavascript1 } from "react-icons/di";
import { SiCplusplus, SiC } from "react-icons/si";

function Challenges() {
  const { isDarkMode } = useContext(ThemeContext);
  const [isActive, setIsActive] = useState("all");
  return (
    <ChallengesDiv isDarkMode={isDarkMode}>
      <SelectLang>
        <SelectLangTitle>Select Language</SelectLangTitle>
        <SelectLangSection>
          <SelectlangSelect
            isActive={isActive === "all"}
            onClick={() => setIsActive("all")}
            isDarkMode={isDarkMode}
          >
            All
          </SelectlangSelect>
          <SelectlangSelect
            isActive={isActive === "c"}
            onClick={() => setIsActive("c")}
            isDarkMode={isDarkMode}
          >
            <SiC size={25} />
            <>C Language</>
          </SelectlangSelect>
          <SelectlangSelect
            isActive={isActive === "c++"}
            onClick={() => setIsActive("c++")}
            isDarkMode={isDarkMode}
          >
            <SiCplusplus size={25} />
            C++
          </SelectlangSelect>
          <SelectlangSelect
            isActive={isActive === "js"}
            onClick={() => setIsActive("js")}
            isDarkMode={isDarkMode}
          >
            <DiJavascript1 size={25} />
            Javascript
          </SelectlangSelect>
          <SelectlangSelect
            isActive={isActive === "py"}
            onClick={() => setIsActive("py")}
            isDarkMode={isDarkMode}
          >
            <TbBrandPython size={25} />
            Python
          </SelectlangSelect>
        </SelectLangSection>
      </SelectLang>

      <ChallengesList></ChallengesList>
    </ChallengesDiv>
  );
}

export default Challenges;

const ChallengesDiv = styled.div`
  width: 100%;
  display: flex;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;
const SelectLang = styled.div`
  width: 20%;
  padding: 20px;
`;

const SelectLangTitle = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const SelectLangSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const SelectlangSelect = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 25px 25%;
  border: 1px solid
    ${(props) =>
      props.isDarkMode
        ? (props) => props.theme.dark.text
        : (props) => props.theme.light.text};
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) =>
    props.isActive ? (props) => props.theme.mainColor : "transparent"};
  &:hover {
    border: 1px solid ${(props) => props.theme.mainColor};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
  }
`;

const ChallengesList = styled.div``;
