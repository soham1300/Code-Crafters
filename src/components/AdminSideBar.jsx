import React, { useContext } from "react";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";

import { ThemeContext } from "../App";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import { BiCodeAlt } from "react-icons/bi";

function AdminSideBar(props) {
  const { isDarkMode } = useContext(ThemeContext);
  const location = useLocation();

  return (
    <Sidebar
      backgroundColor={isDarkMode ? "#1b2225" : "#D8D9DA"}
      style={{ height: "93vh" }}
      collapsedWidth="3.5rem"
      collapsed={props.isMobile ? true : false}
    >
      <Menu
        menuItemStyles={{
          button: ({ level, active, disabled }) => {
            if (level === 0) {
              return {
                color: isDarkMode ? "#fff" : "#1b2225",
                backgroundColor: active && "#663de5",
                boxShadow: active && "0 0 5px #663de5",
                fontWeight: active && "bold !important",
                padding: "0.6rem",
                margin: "0rem",
                borderRadius: "0.6rem 0 0 0.6rem",
                border: active
                  ? isDarkMode
                    ? "1px solid white"
                    : "1px solid black"
                  : "none",

                "&:hover": {
                  backgroundColor: !active
                    ? isDarkMode
                      ? "#29343d !important"
                      : "#b3b2b2 !important"
                    : "#663de5",
                  fontWeight: "bold !important",
                },
              };
            }
          },
        }}
      >
        <MenuItem
          active={location.pathname === "/admin/users"}
          component={<Link to="/admin/users" />}
          icon={<Person2OutlinedIcon size={25} />}
        >
          Users
        </MenuItem>
        <MenuItem
          active={location.pathname === "/admin/add-challenges"}
          component={<Link to="/admin/add-challenges" />}
          icon={<BiCodeAlt size={25} />}
        >
          Add Challenges
        </MenuItem>
      </Menu>
    </Sidebar>
  );
}

export default AdminSideBar;
