import React, { useContext } from "react";
import styled from "styled-components";
import { useUserContext } from "../context/UserContex";
import { ThemeContext } from "../App";

function UserInfo() {
  const { userData } = useUserContext();
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <UserInfoDiv>
      <Bio isDarkMode={isDarkMode} bioAvailable={userData.bio ? true : false}>
        <BioName>About</BioName>
        <BioData>{userData.bio ? userData.bio : "-No bio"}</BioData>
      </Bio>
      <About>
        <UserName>Name : </UserName>
        <Pronouns>Pronouns : </Pronouns>
        <Location> Location :</Location>
        <Education> Education : </Education>
        <Company> Company : </Company>
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
  display: ${(props) => (props.bioAvailable ? "flex" : "none")};
`;

const About = styled.div`
  width: 30vw;
  background-color: red;
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

const UserName = styled.p``;

const Pronouns = styled(UserName)``;

const Location = styled(UserName)``;

const Education = styled(UserName)``;

const Company = styled(UserName)``;
