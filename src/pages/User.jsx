import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../App";
import SideBar from "../components/SideBar";
import styled from "styled-components";
import TopPanel from "../components/TopPanel";
import IsMobile from "../components/IsMobile";
// import BgImg from "../images/BgImg.png";
// import BgImg from "../images/images.jpeg";

// import BgImg from "../images/BgImg.png";
// import BgImgDark from "../images/BgImgDark.jpg";

// import Home from "./Home";
// import Search from "./Search";
// import CodeReview from "./CodeReview";
// import Courses from "./Courses";
// import Mentorship from "./Mentorship";
// import Jobs from "./Jobs";
// import Challenges from "./Challenges";
import { Outlet } from "react-router-dom";
import BanUser from "../images/BanUser.png";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";

function User() {
  const { isDarkMode } = useContext(ThemeContext);
  const isMobile = IsMobile();
  const { currentUser } = useContext(AuthContext);
  const [user, setUser] = useState();
  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "users", currentUser.uid);
      const docSnap = await getDoc(docRef);
      setUser(docSnap.data());
      console.log(docSnap.data());
    };
    fetchData();
  }, [currentUser]);

  console.log(currentUser.uid);
  if (!user) {
    return <>Loading....</>;
  }
  return (
    <HomeBg isDarkMode={isDarkMode}>
      <HomeBgImg isDarkMode={isDarkMode}>
        <HomeDiv isDarkMode={isDarkMode}>
          {user.ban && (
            <BannedMessage>
              <img src={BanUser} alt="" srcset="" />
              User is banned.
            </BannedMessage>
          )}

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
      </HomeBgImg>
    </HomeBg>
  );
}

export default User;

const HomeBg = styled.div`
  background-color: ${(props) => (props.isDarkMode ? "black" : "white")};
`;

const HomeBgImg = styled.div`
  background-color: ${(props) =>
    props.isDarkMode ? "rgba(6, 20, 29)" : "rgba(246, 247, 249)"};

  background-size: cover;
`;

const HomeDiv = styled.div`
  display: flex;
  flex-direction: column;
  /* background-color: ${(props) =>
    props.isDarkMode ? (props) => "#06141D" : (props) => "#F6F7F9"}; */
  background-color: ${(props) =>
    props.isDarkMode ? "rgba(6, 20, 29, 0.8)" : "rgba(246, 247, 249, 0.8)"};
  backdrop-filter: blur(50px); /* A
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
  overflow: auto;
  height: 92vh;
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

const BannedMessage = styled.div`
  color: red;
  font-weight: bold;
  z-index: 1000;
  height: 100%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 1.5rem;
  background-color: rgba(255, 255, 255, 0.8);
`;
