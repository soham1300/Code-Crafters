import React from "react";
import styled from "styled-components";
import { useUserContext } from "../context/UserContex";

function UserInfo() {
  const { userData, updateUser } = useUserContext();
  return (
    <UserInfoDiv>
      <Bio>
        <BioName>Bio</BioName>
        {userData.bio ? userData.bio : "-No bio"}
      </Bio>
      <Intro></Intro>
    </UserInfoDiv>
  );
}

export default UserInfo;

const UserInfoDiv = styled.div``;
const Bio = styled.div`
  width: 100%;
  background-color: red;
`;

const Intro = styled.div`
  width: 30vw;
  background-color: red;
  border-radius: 15px;
`;

const BioName = styled.p`
  padding: 15px;
  color: white;
  font-weight: 600;
  font-size: 18px;
`;
