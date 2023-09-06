import React, { useContext } from "react";
import DarkModeToggle from "react-dark-mode-toggle";

import { ThemeContext } from "../App";

function IsDarkMode() {
  const { isDarkMode, setIsDarkMode } = useContext(ThemeContext);
  return (
    <div>
      <DarkModeToggle onChange={setIsDarkMode} checked={isDarkMode} size={60} />
    </div>
  );
}

export default IsDarkMode;
