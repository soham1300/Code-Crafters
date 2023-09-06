import React, { useContext, useState } from "react";
import { ThemeContext } from "../App";
import styled from "styled-components";
// import TopPanel from "../components/TopPanel";
import Logo from "../components/Logo";
import IsDarkMode from "../components/IsDarkMode";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function CompleteSignup(props) {
  const { isDarkMode } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  // const isDarkMode = true;
  const [selected, setSelected] = useState("");
  const navigate = useNavigate();

  const selectStudent = () => {
    setSelected("student");
  };

  const selectWorking = () => {
    setSelected("working");
  };

  const handleSubmit = async () => {
    if (!selected) {
      props.toast.error("Please select your option");
    } else {
      try {
        await updateDoc(doc(db, "users", currentUser.uid), {
          userType: selected,
        });
        navigate("/user/home");
      } catch (err) {
        props.toast.error("Something went wrong, please try again");
      }
    }
  };
  return (
    <CompleteSignupDiv isDarkMode={isDarkMode}>
      <div>
        <Logo />
        <IsDarkModeBtn>
          <IsDarkMode />
        </IsDarkModeBtn>
      </div>
      <Header1>Welcome to Code Crafters</Header1>
      <Header2>Please select what type of user you are:</Header2>
      <Select>
        <Student
          isDarkMode={isDarkMode}
          isSelected={selected === "student"}
          onClick={selectStudent}
        >
          I'm a Student
        </Student>
        <Working
          isDarkMode={isDarkMode}
          isSelected={selected === "working"}
          onClick={selectWorking}
        >
          I'm a IT Professional
        </Working>
      </Select>
      <ButtonContainer>
        <CompleteSignupBtn isDarkMode={isDarkMode} onClick={handleSubmit}>
          Complete Sign-up
        </CompleteSignupBtn>
      </ButtonContainer>
    </CompleteSignupDiv>
  );
}

export default CompleteSignup;

const CompleteSignupDiv = styled.div`
  height: 100vh;
  width: 100vw;

  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.bg
      : (props) => props.theme.light.bg};
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  display: flex;
  flex-direction: column;
`;

// const Heading = styled.div``;

const Student = styled.div`
  height: 35%;
  width: 25%;
  background-color: ${(props) =>
    props.isSelected
      ? props.theme.mainColor
      : props.isDarkMode
      ? (props) => props.theme.dark.secondry
      : (props) => props.theme.light.secondry};
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  border-radius: 25px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  transform: scale(${(props) => props.isSelected && 1.1});
  user-select: none;
  &:hover {
    cursor: pointer;
    transform: scale(1.1);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5);
    transition: all 0.2s ease-in-out;
  }
  &:active {
    background-color: ${(props) => props.theme.mainColor};
  }
  @media (max-width: 768px) {
    width: 80%;
  }
`;
const Working = styled(Student)``;

const Header1 = styled.div`
  font-size: 3rem;
  text-align: center;
  font-weight: bold;
  margin: 4rem 0;
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Header2 = styled(Header1)`
  font-size: 2rem;
  margin: 0;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Select = styled.div`
  height: 50%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15%;
  @media (max-width: 768px) {
    margin-top: 2rem;
    justify-content: start;
    flex-direction: column;
    gap: 5%;
  }
`;
const IsDarkModeBtn = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: start;
  justify-content: center;
`;

const CompleteSignupBtn = styled.button`
  height: 50px;
  width: 25%;
  font-size: 1.5rem;
  border-radius: 10px;
  background-color: transparent;
  border-color: ${(props) => props.theme.mainColor};
  border-style: solid;
  color: ${(props) => props.theme.mainColor};
  cursor: pointer;
  /* &:hover {
    color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  } */
  position: relative;

  &:after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background-color: ${(props) => props.theme.mainColor};
    transition: width 0.3s ease-in-out;
    border-radius: 10px;

    opacity: 0.3;
  }

  &:hover:after {
    width: 100%;
    border-radius: 10px;
  }
  @media (max-width: 768px) {
    width: 80%;
  }
`;
