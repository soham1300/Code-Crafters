import React, { useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "../App";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

export default function SelectLangComp({ langName, progress, langNameShort }) {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <Selectlang
      isDarkMode={isDarkMode}
      onClick={() => {
        console.log(langNameShort);
        navigate(`/user/domain/${langNameShort}`);
      }}
    >
      <SelectLangDiv>
        <UpText>Problem Solving</UpText>
        <LangName>{langName}</LangName>
        <Box sx={{ width: "90%", padding: "15px 0" }}>
          <LinearProgress variant="determinate" value={progress} />
        </Box>
        <Progress>{progress}%</Progress>
        <SelectLangBtn isDarkMode={isDarkMode}>Solve</SelectLangBtn>
      </SelectLangDiv>
    </Selectlang>
  );
}

const UpText = styled.p`
  font-size: 0.9rem;
  padding: 0 0 5px 0;
  margin: 0;
  opacity: 0.7;
`;

const Selectlang = styled.div`
  display: flex;
  flex-direction: column;
  width: 35%;
  height: 100%;
  border-radius: 10px;
  cursor: pointer;
  background-color: ${(props) =>
    props.isDarkMode ? props.theme.dark.secondry : props.theme.light.secondry};
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.3);
`;

const SelectLangDiv = styled.div`
  padding: 20px;
  width: 100%;
  height: 100%;
`;

const LangName = styled.p`
  font-size: 1.5rem;
  padding: 0;
  margin: 0;
`;

const Progress = styled.p`
  font-size: 1rem;
  padding: 0;
  margin: 0;
`;

const SelectLangBtn = styled.div`
  width: 30%;
  padding: 5px;
  font-size: 1.2rem;
  margin: 10px 0;
  text-align: center;
  color: ${(props) =>
    props.isDarkMode ? props.theme.light.secondry : props.theme.dark.secondry};
  background-color: ${(props) => props.theme.mainColor};
  border-radius: 5px;
`;
