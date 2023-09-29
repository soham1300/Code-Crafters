import React from "react";
import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../App";
import SideBar from "../components/SideBar";
import styled from "styled-components";
import TopPanel from "../components/TopPanel";
import IsMobile from "../components/IsMobile";
// import Home from "./Home";
// import Search from "./Search";
// import CodeReview from "./CodeReview";
// import Courses from "./Courses";
// import Mentorship from "./Mentorship";
// import Jobs from "./Jobs";
// import Challenges from "./Challenges";
import { Outlet } from "react-router-dom";

function User() {
  const { isDarkMode } = useContext(ThemeContext);
  const isMobile = IsMobile();
  return (
    <HomeDiv isDarkMode={isDarkMode}>
      <TopPanelDiv>
        <TopPanel />
      </TopPanelDiv>

      <MainDiv>
        <div>
          <SideBar isMobile={isMobile} />
        </div>
        <AllInfoDiv>
          <AllInfo isDarkMode={isDarkMode}>
            {/* <Home />
          <Search />
          <CodeReview />
          <Courses />
          <Challenges />
          <Mentorship />
          <Jobs /> */}
            <Outlet />
          </AllInfo>
        </AllInfoDiv>
      </MainDiv>
    </HomeDiv>
  );
}

export default User;

const HomeDiv = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.bg
      : (props) => props.theme.light.bg};
  /* position: fixed; */
`;

const MainDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const AllInfo = styled.div``;

const TopPanelDiv = styled.div`
  position: static;
`;

const AllInfoDiv = styled.div`
  flex-grow: 1;
`;
