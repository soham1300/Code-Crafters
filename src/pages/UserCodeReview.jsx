import React, { useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "../App";
import { useNavigate } from "react-router-dom";

function UserCodeReview() {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <UserCodeReviewDiv>
      <UploadCodeReviewBtn
        isDarkMode={isDarkMode}
        onClick={() => navigate("/user/uploadcode")}
      >
        Upload Code
      </UploadCodeReviewBtn>
    </UserCodeReviewDiv>
  );
}

export default UserCodeReview;

const UserCodeReviewDiv = styled.div`
  width: 100%;
  /* background-color: #f5f5f5; */
`;

const UploadCodeReviewBtn = styled.button`
  margin: 0 20px;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.mainColor};
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
  }
`;
