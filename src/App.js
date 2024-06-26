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
import UploadCode from "./pages/UploadCode";
import Profile from "./pages/Profile";
import UserInfo from "./pages/UserInfo";
import UserCodeReview from "./pages/UserCodeReview";
import AdminLogin from "./pages/AdminLogin";
import Admin from "./pages/Admin";
import AddChallenges from "./pages/AddChallenges";
import CodingChallenges from "./pages/CodingChallenges";
import ChallengeLang from "./pages/ChallengeLang";
import HomePage from "./pages/HomePage";
import EditProfile from "./pages/EditProfile";
import AddMentor from "./pages/AddMentor";
import MentorshipChat from "./pages/MentorshipChat";

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
  const [selectChallenge, setSelectChallenge] = useState(null);

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
      secondry: "#1A2731",
      text: "white",
    },
    light: {
      bg: "white",
      primary: "#c5c6c7",
      secondry: "#D8D9DA",
      text: "#1e2025",
    },
    mainColor: "#754CCB",
    mainColorHover: "#452b96",
  };
  return (
    <IsDarkThemeProvider>
      <ThemeProvider theme={theme}>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="login"
            element={<LoginSignin toast={toast} isLogin={true} />}
          />
          <Route
            path="signup"
            element={<LoginSignin toast={toast} isLogin={false} />}
          />
          <Route
            path="completesignup"
            element={<CompleteSignup toast={toast} />}
          />
          <Route path="admin-login" element={<AdminLogin toast={toast} />} />
          <Route path="admin" element={<Admin toast={toast} />}>
            <Route
              path="users"
              element={
                <ProtectedRoute>
                  <Search toast={toast} />
                </ProtectedRoute>
              }
            />
            <Route
              path=":userId"
              element={
                <ProtectedRoute>
                  <Profile toast={toast} />
                </ProtectedRoute>
              }
            />
            <Route
              path="add-challenges"
              element={
                <ProtectedRoute>
                  <AddChallenges toast={toast} />
                </ProtectedRoute>
              }
            />
          </Route>
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
                  <Search toast={toast} />
                </ProtectedRoute>
              }
            />
            <Route
              path="codereview"
              element={
                <ProtectedRoute>
                  <CodeReview toast={toast} />
                </ProtectedRoute>
              }
            />
            <Route
              path="uploadcode"
              element={
                <ProtectedRoute>
                  <UploadCode toast={toast} />
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
                  <Challenges
                    toast={toast}
                    setSelectChallenge={setSelectChallenge}
                  />
                </ProtectedRoute>
              }
            />
            <Route path="domain">
              <Route
                path=":lang"
                element={
                  <ProtectedRoute>
                    <ChallengeLang
                      toast={toast}
                      setSelectChallenge={setSelectChallenge}
                    />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="codingchallenges">
              <Route
                path=":id"
                element={
                  <ProtectedRoute>
                    <CodingChallenges
                      toast={toast}
                      selectChallenge={selectChallenge}
                    />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route
              path="mentorship"
              element={
                <ProtectedRoute>
                  <Mentorship toast={toast} />
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
            <Route path="profile">
              <Route
                path=":userId"
                element={
                  <ProtectedRoute>
                    <Profile toast={toast} />
                  </ProtectedRoute>
                }
              />

              <Route
                path="editprofile"
                element={
                  <ProtectedRoute>
                    <EditProfile toast={toast} />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route
              path="addmentor"
              element={
                <ProtectedRoute>
                  <AddMentor toast={toast} />
                </ProtectedRoute>
              }
            />
            <Route path="mentor">
              <Route
                path=":mentorshipId"
                element={
                  <ProtectedRoute>
                    <MentorshipChat toast={toast} />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="" />} />
        </Routes>
      </ThemeProvider>
    </IsDarkThemeProvider>
  );
}

export default App;
