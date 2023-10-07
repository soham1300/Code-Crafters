import React, { useContext } from "react";
import Logo from "./Logo";
import { styled } from "styled-components";
import { ThemeContext } from "../App";
import { AuthContext } from "../context/AuthContext";
import IsDarkMode from "./IsDarkMode";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";

function TopPanel({ admin }) {
  const { isDarkMode } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  return (
    <TopPanelDiv isDarkMode={isDarkMode}>
      <div>
        <Logo />
      </div>
      <TPRight>
        <IsDarkModeBtn>
          <IsDarkMode />
        </IsDarkModeBtn>
        {admin ? (
          <UserName>{admin}</UserName>
        ) : (
          <User onClick={() => navigate(`/user/${currentUser.uid}`)}>
            <Avatar alt={currentUser.displayName} src={currentUser.photoURL} />
            <UserName>{currentUser.displayName}</UserName>
          </User>
        )}
      </TPRight>
    </TopPanelDiv>
  );
}

export default TopPanel;

const TopPanelDiv = styled.div`
  height: 7vh;
  width: 100%;
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.primary
      : (props) => props.theme.light.secondry};
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const User = styled.div`
  font-size: 1.3rem;
  margin-right: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  cursor: pointer;
`;

const TPRight = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: center; */
`;

const IsDarkModeBtn = styled.div`
  margin-right: 1rem;
`;

const UserName = styled.p`
  @media (max-width: 768px) {
    display: none;
  }
`;
