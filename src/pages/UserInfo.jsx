import React, { useContext } from "react";
import styled from "styled-components";
import { UserContext } from "../context/UserContex";
import { ThemeContext } from "../App";

function UserInfo() {
  const { userData } = useContext(UserContext);
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <UserInfoDiv>
      <Bio isDarkMode={isDarkMode} isAvail={userData.bio}>
        <BioName>About</BioName>
        <BioData>{userData.bio ? userData.bio : "-No bio"}</BioData>
      </Bio>
      <About isDarkMode={isDarkMode}>
        <UserName isAvail={userData.userName}>
          Name : {userData.userName}
        </UserName>
        <Gender isAvail={userData.gender}> Gender : {userData.gender}</Gender>
        <Location isAvail={userData.location}>
          {" "}
          Location : {userData.location}
        </Location>
        <Education isAvail={userData.education}>
          {" "}
          Education : {userData.education}
        </Education>
        <Company isAvail={userData.company}>
          {" "}
          Company : {userData.company}
        </Company>
      </About>
    </UserInfoDiv>
  );
}

export default UserInfo;

const UserInfoDiv = styled.div``;
const Bio = styled.div`
  width: 100%;
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.primary
      : (props) => props.theme.light.primary};
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  display: ${(props) => (props.isAvail ? "flex" : "none")};
`;

const About = styled.div`
  width: 30vw;
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.primary
      : (props) => props.theme.light.primary};
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  border-radius: 15px;
`;

const BioName = styled.p`
  padding: 15px 0 0 15px;
  color: white;
  font-weight: 600;
  font-size: 18px;
`;

const BioData = styled.p`
  padding: 0 0 15px 15px;
`;

const UserName = styled.p`
  margin: 15px 0 0 15px;
  display: ${(props) => (props.isAvail ? "flex" : "none")};
`;

const Location = styled(UserName)``;

const Education = styled(UserName)``;

const Company = styled(UserName)``;

const Gender = styled(UserName)``;
