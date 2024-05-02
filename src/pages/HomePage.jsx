import React, { useContext } from "react";
import styled from "styled-components";
import Logo from "../components/Logo";
import IsDarkMode from "../components/IsDarkMode";
import { ThemeContext } from "../App";
import { useNavigate } from "react-router-dom";
import EastIcon from "@mui/icons-material/East";

function HomePage() {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  return (
    <HomePageDiv isDarkMode={isDarkMode}>
      <HomePageNav isDarkMode={isDarkMode}>
        <LogoDiv>
          <Logo />
        </LogoDiv>
        <RightNavDiv>
          <IsDarkMode />
          <LoginBtn
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </LoginBtn>
          <SignupBtn
            onClick={() => {
              navigate("/signup");
            }}
          >
            Try now
          </SignupBtn>
        </RightNavDiv>
      </HomePageNav>
      <HomeDiv1>
        <HomeDiv1Text>
          <Title>Welcome to CodeCrafters!</Title>
          <SubTitle>
            Start your coding adventure with CoreCrafters! Explore our
            challenges, connect with fellow coders, and take your skills to new
            heights.
          </SubTitle>
          <ExploreBtn
            onClick={() => {
              navigate("/signup");
            }}
          >
            Explore and try now <EastIcon />
          </ExploreBtn>
        </HomeDiv1Text>
        <HomeImg>
          <lottie-player
            autoplay
            loop
            mode="normal"
            src="https://lottie.host/ba2e6040-37b6-4328-bdfa-2163a165e687/r4WXp20I9a.json"
          ></lottie-player>
        </HomeImg>
      </HomeDiv1>

      {/* <h2>Features</h2>
      <ul>
        <li>Practice coding concepts step-by-step</li>
        <li>Get feedback and hints as you code</li>
        <li>Earn achievements for completing challenges</li>
      </ul> */}
      {/* 
      <button>Start Coding Now</button> */}
    </HomePageDiv>
  );
}

export default HomePage;

const HomePageDiv = styled.div`
  height: 100vh;
  width: 100vw;
  color: ${(props) =>
    props.isDarkMode ? props.theme.dark.text : props.theme.light.text};
  background-color: ${(props) =>
    props.isDarkMode ? props.theme.dark.bg : props.theme.light.bg};
`;

const HomePageNav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) =>
    props.isDarkMode ? props.theme.dark.bg : props.theme.light.bg};
`;

const LoginBtn = styled.button`
  cursor: pointer;
  background-color: #754ccb;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  opacity: 0.8;
  &:hover {
    opacity: 1;
    color: rgba(255, 255, 255, 1);
    box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
  }
`;

const SignupBtn = styled.button`
  cursor: pointer;
  background-color: #754ccb;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  &:hover {
    opacity: 1;
    color: rgba(255, 255, 255, 1);
    box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
  }
`;

const LogoDiv = styled.div`
  background-color: #754ccb;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RightNavDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
`;

const Title = styled.p`
  font-size: 3rem;
  padding: 0;
  margin: 0;
  font-weight: bold;
`;

const SubTitle = styled.p`
  font-size: 1.5rem;
  padding: 0;
  margin: 0;
  opacity: 0.7;
  margin-top: 10px;
  margin-bottom: 20px;
  font-weight: bold;
  line-height: 1.5;
  max-width: 800px;
  word-break: break-word;
  @media (max-width: 768px) {
    width: 90%;
  }
`;

const HomeDiv1 = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  /* background-color: #754ccb; */
  width: 100%;
  height: 90vh;
`;

const HomeDiv1Text = styled.div`
  display: flex;
  flex-direction: column;
`;

const HomeImg = styled.div`
  width: 50%;
`;

const ExploreBtn = styled.button`
  cursor: pointer;
  background-color: #754ccb;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1rem;
  font-weight: bold;
  opacity: 0.8;
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 300px;
  height: 50px;
  gap: 5px;
  @media (max-width: 768px) {
    width: 100%;
  }
  &:hover {
    opacity: 1;
    color: rgba(255, 255, 255, 1);
    box-shadow: 0 5px 15px rgba(145, 92, 182, 0.4);
  }
  &:focus {
    outline: none;
  }
  &:active {
    opacity: 0.8;
  }
`;
