import React, { useContext } from "react";
import Logo from "./Logo";
import { styled } from "styled-components";
import { ThemeContext } from "../App";
import { AuthContext } from "../context/AuthContext";
import IsDarkMode from "./IsDarkMode";

function TopPanel() {
  const { isDarkMode } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  return (
    <TopPanelDiv isDarkMode={isDarkMode}>
      <div>
        <Logo />
      </div>
      <TPRight>
        <IsDarkModeBtn>
          <IsDarkMode />
        </IsDarkModeBtn>
        
        <User><UserDP src={currentUser.photoURL} />{currentUser.displayName}</User>

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
`;

const TPRight = styled.div`
  display: flex;
  align-items : center;
  justify-content : center;
`;

const IsDarkModeBtn = styled.div`
  margin-right: 1rem;
`;

const UserDP = styled.img`
  height: 4vh;
  border-radius: 15px;
`