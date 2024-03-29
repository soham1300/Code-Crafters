import React, { useContext } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";

import { ThemeContext } from "../App";
import { AiOutlineHome } from "react-icons/ai";
import { GoCodeReview } from "react-icons/go";
import { BiCodeAlt, BiSearchAlt2 } from "react-icons/bi";
// import styled from "styled-components";
import { SiCoursera } from "react-icons/si";
import { PiBagSimpleDuotone, PiChalkboardTeacher } from "react-icons/pi";

function SideBar(props) {
  const { isDarkMode } = useContext(ThemeContext);
  const location = useLocation();

  return (
    <Sidebar
      backgroundColor={
        isDarkMode ? "rgb(26, 39, 49,0.6)" : "rgb(216, 217, 218, 0.6)"
      }
      style={{
        height: "93vh",
        border: "0px",
        borderRight: "0px solid #2B2E36",
      }}
      collapsedWidth="4rem"
      collapsed={props.isMobile ? true : false}
    >
      <Menu
        menuItemStyles={{
          button: ({ level, active, disabled }) => {
            if (level === 0) {
              return {
                color: isDarkMode ? "#fff" : "#1b2225",
                backgroundColor: active && "rgb(117,76,203)",

                // ? isDarkMode
                //   ? "#29343d !important"
                //   : "#b3b2b2 !important"
                // : undefined,
                boxShadow: active && "0 0 5px rgb(117,76,203)",
                fontWeight: active && "bold !important",
                padding: "0.6rem",
                margin: "0.5rem",

                borderRadius: "0.6rem 0.6rem 0.6rem 0.6rem",
                // border: active
                //   ? isDarkMode
                //     ? "1px solid white"
                //     : "1px solid black"
                //   : "none",
                fontSize: "1.2rem",
                "&:hover": {
                  backgroundColor: !active
                    ? isDarkMode
                      ? "#1B1D22 !important"
                      : "#b3b2b2 !important"
                    : "rgb(85, 56, 148)",
                  // color: "white !important",
                  fontWeight: "bold !important",
                },
              };
            }
          },
        }}
      >
        <MenuItem
          active={location.pathname === "/user/home"}
          component={<Link to="/user/home" />}
          icon={<AiOutlineHome size={25} />}
        >
          Home
        </MenuItem>
        <MenuItem
          active={location.pathname === "/user/search"}
          component={<Link to="/user/search" />}
          icon={<BiSearchAlt2 size={25} />}
        >
          Search
        </MenuItem>
        <MenuItem
          active={location.pathname === "/user/codereview"}
          component={<Link to="/user/codereview" />}
          icon={<GoCodeReview size={25} />}
        >
          Code Review
        </MenuItem>
        <MenuItem
          active={location.pathname === "/user/courses"}
          component={<Link to="/user/courses" />}
          icon={<SiCoursera size={25} />}
        >
          Courses
        </MenuItem>
        <MenuItem
          active={location.pathname === "/user/challenges"}
          component={<Link to="/user/challenges" />}
          icon={<BiCodeAlt size={25} />}
        >
          Coding Challenges
        </MenuItem>
        <MenuItem
          active={location.pathname === "/user/mentorship"}
          component={<Link to="/user/mentorship" />}
          icon={<PiChalkboardTeacher size={25} />}
        >
          Mentorship
        </MenuItem>
        <MenuItem
          active={location.pathname === "/user/jobs"}
          component={<Link to="/user/jobs" />}
          icon={<PiBagSimpleDuotone size={25} />}
        >
          Search Jobs
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default SideBar;
