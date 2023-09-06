import React, { useContext } from "react";
import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { ThemeContext } from "../App";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import { javascript } from "@codemirror/lang-javascript";

function UploadCode() {
  const { isDarkMode } = useContext(ThemeContext);
  const onChange = React.useCallback((value, viewUpdate) => {
    console.log("value:", value);
  }, []);
  return (
    <UploadCodeDiv isDarkMode={isDarkMode}>
      <Headline isDarkMode={isDarkMode}>Upload Your Code</Headline>
      <CodeBtn>Enter Code</CodeBtn>
      <LinkBtn>Enter Link</LinkBtn>
      <CodeMirror
        theme={isDarkMode ? githubDark : githubLight}
        value="//Enter your code"
        height="70vh"
        extensions={[javascript({ jsx: true })]}
        onChange={onChange}
      />
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
`;
const Headline = styled.h1`
  text-align: center;
`;

const CodeBtn = styled.button``;

const LinkBtn = styled.button``;
