import React from "react";
import styled from "styled-components";
import { useContext } from "react";
import { ThemeContext } from "../App";
import { useNavigate } from "react-router-dom";

function UserProfileMobile({ userData }) {
  const navigate = useNavigate();
  const user = userData;
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <UsernameContainer
      isDarkMode={isDarkMode}
      onClick={() => navigate(`/user/${user.uid}`)}
    >
      <ProfileContainer>
        <ProfileImg>
          <ProfileImage src={user.photoURL} alt={user.displayName} />
        </ProfileImg>
        <ProfileDescription>
          <UserTitle isDarkMode={isDarkMode}>{user.displayName}</UserTitle>
          <Username>
            {user.userType === "working" ? "Professional" : "Studying"}
          </Username>
        </ProfileDescription>
      </ProfileContainer>
    </UsernameContainer>
  );
}

export default UserProfileMobile;

const UsernameContainer = styled.div`
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => "#16161a"
      : (props) => props.theme.light.primary};
  width: 75vw;
  display: flex;
  border-radius: 15px;
  padding: 0 10px;
  justify-content: space-between;
  border: 1px solid
    ${(props) =>
      props.isDarkMode
        ? (props) => props.theme.dark.text
        : (props) => props.theme.light.text};
`;

const ProfileContainer = styled.div`
  display: flex;
  gap: 0.5em;
  justify-content: space-between;
  align-items: center;
`;

const ProfileDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ProfileImg = styled.div`
  border-radius: 50%;
  width: 70px;
  height: 70px;
  overflow: hidden;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const UserTitle = styled.p`
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  font-weight: bold;
  font-size: 1.2em;
`;

const Username = styled.p`
  color: #4c4c55;
`;
