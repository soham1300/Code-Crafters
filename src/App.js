import { useState, useEffect, createContext } from "react";
import "./App.css";
import { ThemeProvider } from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import LoginSignin from "./pages/LoginSignin";
import Home from "./pages/Home";
import CompleteSignup from "./pages/CompleteSignup";
import Search from "./pages/Search";
import CodeReview from "./pages/CodeReview";
import Courses from "./pages/Courses";
import Mentorship from "./pages/Mentorship";
import Jobs from "./pages/Jobs";
import Challenges from "./pages/Challenges";
import User from "./pages/User";

export const ThemeContext = createContext();

export const IsDarkThemeProvider = ({ children }) => {
  const isDarkTheme = useThemeDetector();
  const [isDarkMode, setIsDarkMode] = useState(isDarkTheme);
  const value = {
    isDarkMode,
    setIsDarkMode,
  };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

const useThemeDetector = () => {
  const getCurrentTheme = () =>
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());
  const mqListener = (e) => {
    setIsDarkTheme(e.matches);
  };

  useEffect(() => {
    const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");
    darkThemeMq.addListener(mqListener);
    return () => darkThemeMq.removeListener(mqListener);
  }, []);
  return isDarkTheme;
};

function App() {
  const { currentUser } = useContext(AuthContext);
  const ProtectedRoute = ({ children }) => {
    if (!currentUser) {
      return <Navigate to="/login" />;
    }
    return children;
  };
  const theme = {
    dark: {
      bg: "#1e2025",
      primary: "#1b2225",
      secondry: "#29343d",
      text: "white",
    },
    light: {
      bg: "white",
      primary: "#c5c6c7",
      secondry: "#D8D9DA",
      text: "#1e2025",
    },
    mainColor: "#663de5",
    mainColorHover: "#452b96",
  };
  return (
    <IsDarkThemeProvider>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <Routes>
          <Route path="login" element={<LoginSignin toast={toast} />} />
          <Route
            path="completesignup"
            element={<CompleteSignup toast={toast} />}
          />
          <Route
            path="user"
            // index
            element={
              <ProtectedRoute>
                <User />
              </ProtectedRoute>
            }
          >
            <Route
              path="home"
              element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              }
            />
            <Route
              path="search"
              element={
                <ProtectedRoute>
                  <Search />
                </ProtectedRoute>
              }
            />
            <Route
              path="codereview"
              element={
                <ProtectedRoute>
                  <CodeReview />
                </ProtectedRoute>
              }
            />
            <Route
              path="courses"
              element={
                <ProtectedRoute>
                  <Courses />
                </ProtectedRoute>
              }
            />
            <Route
              path="challenges"
              element={
                <ProtectedRoute>
                  <Challenges />
                </ProtectedRoute>
              }
            />
            <Route
              path="mentorship"
              element={
                <ProtectedRoute>
                  <Mentorship />
                </ProtectedRoute>
              }
            />
            <Route
              path="jobs"
              element={
                <ProtectedRoute>
                  <Jobs />
                </ProtectedRoute>
              }
            />
          </Route>

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </ThemeProvider>
    </IsDarkThemeProvider>
  );
}

export default App;
