import React, { useContext, useEffect, useState } from "react";
import Logo from "./Logo";
import { styled } from "styled-components";
import { ThemeContext } from "../App";
import { AuthContext } from "../context/AuthContext";
import IsDarkMode from "./IsDarkMode";
import Avatar from "@mui/material/Avatar";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";
import { toast } from "react-toastify";

function TopPanel({ admin }) {
  const { isDarkMode } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  const [updateUserData, setUpdateUserData] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      const fetchData = async () => {
        const userData = await getDoc(doc(db, "users", currentUser.uid));
        setUpdateUserData(userData.data());
      };
      fetchData();
    } catch (error) {
      setError("Error getting documents: ", error);
    }
  }, [currentUser.uid]);

  if (error) {
    toast.error(error);
  }
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
          <User onClick={() => navigate(`/user/profile/${updateUserData.uid}`)}>
            <Avatar
              alt={updateUserData.displayName}
              src={updateUserData.photoURL}
            />
            <UserName>{updateUserData.displayName}</UserName>
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
    props.isDarkMode ? "rgb(26, 39, 49,0.6)" : "rgb(216, 217, 218, 0.6)"};
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
  justify-content: center;
`;

const IsDarkModeBtn = styled.div`
  margin-right: 1rem;
  text-align: center;
`;

const UserName = styled.p`
  @media (max-width: 768px) {
    display: none;
  }
`;
