import React, { useContext, useState } from "react";
import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { ThemeContext } from "../App";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { javascript } from "@codemirror/lang-javascript";
// import { python } from "@codemirror/lang-python";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";
import { AuthContext } from "../context/AuthContext";

function UploadCode() {
  const [code, setCode] = useState("");
  const { isDarkMode } = useContext(ThemeContext);
  const onChange = React.useCallback((value, viewUpdate) => {
    console.log("value:", value);
    setCode(value);
  }, []);
  const [isEnterCode, setIsEnterCode] = useState(true);
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext);

  const clickBack = () => {
    navigate(-1);
  };

  const clickSubmit = async () => {
    try {
      const docRef = await addDoc(collection(db, "codeReview"), {
        code: code,
        time: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString(),
      });
      await updateDoc(doc(db, "users", currentUser.uid), {
        codeReview: arrayUnion(docRef.id),
      });
      console.log(currentUser.uid);
    } catch (e) {}
  };

  return (
    <UploadCodeDiv isDarkMode={isDarkMode}>
      <Headline isDarkMode={isDarkMode}>Upload Your Code</Headline>
      <CodeBtn
        isDarkMode={isDarkMode}
        isEnterCode={isEnterCode}
        onClick={() => {
          setIsEnterCode(true);
        }}
      >
        Enter Code
      </CodeBtn>
      <LinkBtn
        isDarkMode={isDarkMode}
        isEnterCode={isEnterCode}
        onClick={() => {
          setIsEnterCode(false);
        }}
      >
        Enter Link
      </LinkBtn>
      <CodeMirrorDiv isEnterCode={isEnterCode}>
        <CodeMirror
          theme={isDarkMode ? githubDark : githubLight}
          value="//Enter your code"
          height="60vh"
          extensions={[javascript({ jsx: true })]}
          onChange={onChange}
        />
      </CodeMirrorDiv>
      <LinkDiv isEnterCode={isEnterCode}>
        <LinkInput isDarkMode={isDarkMode} />
      </LinkDiv>
      <Instructions>
        <InstTitle>Instructions for Reviewers</InstTitle>
        <Textarea
          rows="4"
          cols="50"
          name="comment"
          form="usrform"
          isDarkMode={isDarkMode}
        />
      </Instructions>
      <BackBtn isDarkMode={isDarkMode} onClick={clickBack}>
        Back
      </BackBtn>
      <SubmitBtn isDarkMode={isDarkMode} onClick={clickSubmit}>
        Submit
      </SubmitBtn>
    </UploadCodeDiv>
  );
}

export default UploadCode;

const UploadCodeDiv = styled.div`
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  width: 83vw;
  height: 93vh;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track:hover {
    background: #555;
  }
  &::-webkit-scrollbar-thumb:active {
    background: #333;
  }
`;
const Headline = styled.h1`
  text-align: center;
`;

const CodeBtn = styled.button`
  margin: 0 20px;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.isEnterCode ? (props) => props.theme.mainColor : "transparent"};
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  border: 2px solid
    ${(props) =>
      props.isDarkMode
        ? (props) => props.theme.dark.text
        : (props) => props.theme.light.text};
  &:hover {
    cursor: pointer;
    border: 2px solid ${(props) => props.theme.mainColorHover};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
    /* color: ${(props) => props.theme.mainColorHover}; */
  }
`;

const LinkBtn = styled(CodeBtn)`
  background-color: ${(props) =>
    props.isEnterCode ? "transparent" : (props) => props.theme.mainColor};
`;

const CodeMirrorDiv = styled.div`
  display: ${(props) => (props.isEnterCode ? "block" : "none")};
  margin: 20px;
`;

const LinkDiv = styled.div`
  display: ${(props) => (!props.isEnterCode ? "block" : "none")};
  margin: 20px;
`;

const LinkInput = styled.input.attrs({
  type: "url",
  placeholder: "Enter link to code",
})`
  width: 90%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s;
  background-color: transparent;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  &:focus {
    border-color: ${(props) => props.theme.mainColor};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
  }
  &::placeholder {
    color: #999;
  }
`;

const Instructions = styled.div`
  margin: 20px;
`;

const InstTitle = styled.p`
  font-size: 1.5rem;
  font-weight: 500;
`;

const Textarea = styled.textarea`
  width: 50%;
  height: 10rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: transparent;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  border: 2px solid #ccc;

  &:focus {
    outline: none;
    border-color: ${(props) => props.theme.mainColor};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
  }
`;

const BackBtn = styled(CodeBtn)`
  margin-bottom: 20px;
  &:hover {
    cursor: pointer;
    border: 2px solid ${(props) => props.theme.mainColorHover};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
    background-color: ${(props) => props.theme.mainColor};
  }
`;

const SubmitBtn = styled(CodeBtn)`
  margin-bottom: 20px;
  &:hover {
    cursor: pointer;
    border: 2px solid ${(props) => props.theme.mainColorHover};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
    background-color: ${(props) => props.theme.mainColor};
  }
`;
