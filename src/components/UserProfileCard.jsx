import React from "react";
import styled from "styled-components";
import gradient from "random-gradient";
import { useContext } from "react";
import { ThemeContext } from "../App";
import { useNavigate } from "react-router-dom";

function UserProfileCard({ userData }) {
  const navigate = useNavigate();
  const user = userData;
  const { isDarkMode } = useContext(ThemeContext);
  return (
    <Card isDarkMode={isDarkMode}>
      <CoverPhoto
        gradient={gradient}
        displayName={user.displayName}
        isDarkMode={isDarkMode}
        uid={user.uid}
      >
        <img src={user.photoURL} alt={user.displayName} />
      </CoverPhoto>
      <ProfileName isDarkMode={isDarkMode}>{user.displayName} </ProfileName>
      <About>{user.userType === "working" ? "Professional" : "Studying"}</About>
      <Btn
        isDarkMode={isDarkMode}
        onClick={() => navigate(`/user/${user.displayName}`)}
      >
        {" "}
        View{" "}
      </Btn>
      <Btn isDarkMode={isDarkMode}>Following</Btn>
      {/* <Icons>
        <i className="fa-brands fa-linkedin"></i>
        <i className="fa-brands fa-github"></i>
        <i className="fa-brands fa-youtube"></i>
        <i className="fa-brands fa-twitter"></i>
      </Icons> */}
    </Card>
  );
}

export default UserProfileCard;

const Card = styled.div`
  padding: 15px;
  width: 20vw;
  max-width: 300px;
  background: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.primary
      : (props) => props.theme.light.primary};
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.7);
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const CoverPhoto = styled.div`
  position: relative;
  background: ${(props) => props.gradient(props.displayName + props.uid)};

  background-size: cover;
  height: 10vh;
  border-radius: 5px 5px 0 0;

  & img {
    position: absolute;
    width: 120px;
    bottom: -60px;
    left: 15px;
    border-radius: 50%;
    border: 2px solid
      ${(props) =>
        props.isDarkMode
          ? (props) => props.theme.dark.primary
          : (props) => props.theme.light.primary};
    background: ${(props) =>
      props.isDarkMode
        ? (props) => props.theme.dark.primary
        : (props) => props.theme.light.primary};
    padding: 5px;
  }
`;

const ProfileName = styled.h3`
  font-size: 20px;
  margin: 25px 0 0 120px;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const About = styled.p`
  margin-top: 30px;
  line-height: 1.6;
`;

const Btn = styled.button`
  margin: 15px 15px;
  background: ${(props) => props.theme.mainColor};
  padding: 10px 25px;
  border-radius: 3px;
  border: 1px solid ${(props) => props.theme.mainColor};
  font-weight: bold;
  font-family: Montserrat;
  cursor: pointer;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  transition: 0.2s;

  &:last-of-type {
    background: transparent;
  }

  &:hover {
    background: ${(props) => props.theme.mainColorHover};
  }
`;
