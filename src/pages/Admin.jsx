import React, { useContext } from "react";
import styled from "styled-components";
import AdminSideBar from "../components/AdminSideBar";
import IsMobile from "../components/IsMobile";
import { ThemeContext } from "../App";
import TopPanel from "../components/TopPanel";
import { Outlet } from "react-router-dom";

function Admin() {
  const { isDarkMode } = useContext(ThemeContext);
  const isMobile = IsMobile();
  return (
    <AdminDiv isDarkMode={isDarkMode}>
      <TopPanelDiv>
        <TopPanel admin={"Admin"} />
      </TopPanelDiv>

      <MainDiv>
        <div>
          <AdminSideBar isMobile={isMobile} />
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
    </AdminDiv>
  );
}

export default Admin;

const AdminDiv = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.bg
      : (props) => props.theme.light.bg};
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
  overflow: auto;
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track:hover {
    background: #555;
  }
  &::-webkit-scrollbar-thumb:active {
    background: #333;
  }
`;
