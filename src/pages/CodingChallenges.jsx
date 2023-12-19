import React, { useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "../App";

function CodingChallenges({ selectChallenge }) {
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <CodingChallengesDiv isDarkMode={isDarkMode}>
      <CodingChallengesDetails>
        <ChallengeName>{selectChallenge.title} </ChallengeName>
        <ChallengeTitle>Task </ChallengeTitle>
        <ChallengeDetails>Details </ChallengeDetails>
        <ChallengeTitle>Note </ChallengeTitle>
        <ChallengeDetails>Details </ChallengeDetails>
        <ChallengeTitle>Input Format </ChallengeTitle>
        <ChallengeDetails>Details </ChallengeDetails>
        <ChallengeTitle>Output Format </ChallengeTitle>
        <ChallengeDetails>Details </ChallengeDetails>
        <ChallengeTitle>Sample Input </ChallengeTitle>
        <ChallengeDetails>Details </ChallengeDetails>
        <ChallengeTitle>Sample Output </ChallengeTitle>
        <ChallengeDetails>Details </ChallengeDetails>
      </CodingChallengesDetails>
    </CodingChallengesDiv>
  );
}

export default CodingChallenges;

const CodingChallengesDiv = styled.div`
  height: 93vh;
  width: 100%;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  /* background-color: red; */
`;

const CodingChallengesDetails = styled.div`
  height: 100%;
  width: 50%;
  border-right: 1px solid #888;
`;

const ChallengeName = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 10px;
  margin-left: 10px;
`;

const ChallengeTitle = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  /* margin-bottom: 5px; */
  margin-left: 10px;
`;

const ChallengeDetails = styled.p`
  font-size: 1rem;
  margin-bottom: 5px;
  margin-left: 10px;
`;
