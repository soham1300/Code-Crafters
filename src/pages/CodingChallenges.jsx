import React, { useContext, useCallback, useState } from "react";
import styled from "styled-components";
import { ThemeContext } from "../App";
import CodeMirror from "@uiw/react-codemirror";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { javascript } from "@codemirror/lang-javascript";
import axios from "axios";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CircularProgress from "@mui/material/CircularProgress";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
import { db } from "../DB/FirebaseConfig";
import { useParams } from "react-router-dom";

function CodingChallenges({ selectChallenge }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [code, setCode] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
  const [output, setOutput] = useState("");
  const [cpuTime, setCpuTime] = useState("");
  const [memory, setMemory] = useState("");
  const lang = selectChallenge.lang;
  const { currentUser } = useContext(AuthContext);
  const params = useParams();

  const onChange = useCallback((value, viewUpdate) => {
    console.log("value:", value);
    setCode(value);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const options = {
      method: "POST",
      url: "https://online-code-compiler.p.rapidapi.com/v1/",
      headers: {
        "content-type": "application/json",
        "X-RapidAPI-Key": "4cbcbfffe6msh96147c9856bf96cp161ac3jsn0ee18ff39ef7",
        "X-RapidAPI-Host": "online-code-compiler.p.rapidapi.com",
      },
      data: {
        language: lang,
        version: "latest",
        code: code,
        input: null,
      },
    };
    try {
      setButtonClicked(true);
      const response = await axios.request(options);
      setButtonClicked(false);
      setCpuTime(response.data.cpuTime);
      setMemory(response.data.memory);
      setOutput(response.data.output);
      console.log(response.data.output);
      await updateDoc(doc(db, "users", currentUser.uid), {
        codeChallenges: arrayUnion({
          challengeId: params.id,
          timestamp: new Date(),
          cpuTime: response.data.cpuTime,
          memory: response.data.memory,
          output: response.data.output,
          language: lang,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };

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
      <SolveCodeDiv>
        <CodeMirrorDiv>
          <CodeMirror
            theme={isDarkMode ? githubDark : githubLight}
            value="//Enter your code"
            height="60vh"
            width="98%"
            extensions={[javascript({ jsx: true })]}
            onChange={onChange}
            // options={{ lineNumbers: false }}
          />
        </CodeMirrorDiv>
        <UploadCodeBtnDiv>
          <UploadCodeBtnText>Run Code To See Result</UploadCodeBtnText>
          {buttonClicked ? (
            <UploadCodeBtn isDarkMode={isDarkMode}>
              <CircularProgress size="1rem" color="inherit" />
              Running Code
            </UploadCodeBtn>
          ) : (
            <UploadCodeBtn
              isDarkMode={isDarkMode}
              onClick={(e) => handleSubmit(e)}
            >
              <PlayArrowIcon />
              Run Code
            </UploadCodeBtn>
          )}
        </UploadCodeBtnDiv>
        {output && (
          <>
            <ResultDiv>
              <ResultText>Result</ResultText>
              <ResultShow>&gt; {output}</ResultShow>
            </ResultDiv>
            <ResultData>
              <CpuUsed>
                <CpuText>Cpu Used:</CpuText>
                <CpuResult>{cpuTime}</CpuResult>
              </CpuUsed>
              <RamUsed>
                <RamText>Ram Used:</RamText>
                <RamResult>{memory}</RamResult>
              </RamUsed>
            </ResultData>
          </>
        )}
      </SolveCodeDiv>
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
  display: flex;
  flex-direction: row;
`;

const CodingChallengesDetails = styled.div`
  height: 100%;
  width: 40%;
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

const SolveCodeDiv = styled.div`
  width: 100%;
  margin: 20px 0 0 20px;
`;

const CodeMirrorDiv = styled.div`
  width: 100%;
  border-radius: 20px;
`;

const UploadCodeBtnDiv = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UploadCodeBtnText = styled.p`
  opacity: 0.5;
`;

const UploadCodeBtn = styled.button`
  margin: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 1.2rem;
  background-color: ${(props) => props.theme.mainColor};
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  /* border: 2px solid;
  ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text}; */
  border: 2px solid transparent;
  &:hover {
    cursor: pointer;
    border: 2px solid ${(props) => props.theme.mainColorHover};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
  }
`;

const ResultDiv = styled.div``;

const ResultText = styled.div`
  font-size: 1.5rem;
`;

const ResultShow = styled.div`
  background-color: black;
  max-height: 200px;
  width: 96%;
  border-radius: 5px;
  margin-top: 12px;
  padding: 12px;
`;

const ResultData = styled.div`
  display: flex;
  margin-top: 20px;
  gap: 8%;
`;

const CpuUsed = styled.div`
  width: 45%;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  flex-direction: column;
`;

const RamUsed = styled.div`
  width: 45%;
  background-color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  flex-direction: column;
`;

const CpuText = styled.p`
  font-size: 1.5rem;
`;

const RamText = styled.p`
  font-size: 1.5rem;
`;

const CpuResult = styled.p`
  font-size: 2rem;
  color: ${(props) => props.theme.mainColor};
  margin: 0 0 20px 0;
`;

const RamResult = styled.p`
  font-size: 2rem;
  color: ${(props) => props.theme.mainColor};
  margin: 0 0 20px 0;
`;
