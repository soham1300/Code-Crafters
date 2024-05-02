import React, { useEffect, useContext, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";
import styled from "styled-components";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import gradient from "random-gradient";
import { ThemeContext } from "../App";
import { UserContext } from "../context/UserContex";
import { AuthContext } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../DB/FirebaseConfig";
import UserCodeReview from "./UserCodeReview";

function Profile({ toast }) {
  const params = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const [updateUserData, setUpdateUserData] = useState(null);
  const { userData, updateUser } = useContext(UserContext);
  const userId = params.userId;
  const { currentUser } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const [languages, setLanguages] = useState([]);
  const iconContainerRef = useRef(null); // Reference to the DOM element where the icon will be displayed
  const [repos, setRepos] = useState([]);
  const token =
    "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"; // Replace with your GitHub token

  useEffect(() => {
    try {
      const fetchData = async () => {
        const userData = await getDoc(doc(db, "users", userId));
        setUpdateUserData(userData.data());

        fetch(
          `https://api.github.com/users/${
            userData.data().githubUsername
          }/repos`,
          {
            headers: {
              Authorization: token,
            },
          }
        )
          .then((response) => response.json())
          .then(async (repos) => {
            const repositories = repos.map((repo) => ({
              name: repo.name,
              url: repo.html_url,
              languages_url: repo.languages_url,
              languages: [], // Initialize with empty array
            }));
            setRepos(repositories);

            const allLanguagesSet = new Set();

            for (const repo of repositories) {
              const languagesResponse = await fetch(repo.languages_url, {
                headers: {
                  Authorization: token,
                },
              });
              const languagesData = await languagesResponse.json();
              Object.keys(languagesData).forEach((language) => {
                allLanguagesSet.add(language);
              });
              repo.languages = Object.keys(languagesData);
            }

            setLanguages(Array.from(allLanguagesSet));
          })
          .catch((error) => {
            console.error("Error fetching repositories:", error);
          });
      };
      fetchData();
    } catch (error) {
      setError("Error getting documents: ", error);
    }
  }, [userId]);

  if (updateUserData) {
    updateUser(updateUserData);
  }

  if (!updateUserData) {
    return <div>Loading...</div>;
  }

  if (error) {
    toast.error(error);
  }

  return (
    <ProfileDiv>
      <Card isDarkMode={isDarkMode}>
        <CoverPhoto
          gradient={gradient}
          displayName={updateUserData.displayName}
          isDarkMode={isDarkMode}
          uid={updateUserData.uid}
        >
          <img src={updateUserData.photoURL} alt={updateUserData.displayName} />
        </CoverPhoto>
        <ProfileBtn>
          <ProfileData>
            <ProfileName isDarkMode={isDarkMode}>
              {updateUserData.displayName}
            </ProfileName>
            {/* <UserFollowData>0 Followers | 0 Following</UserFollowData> */}
            <UserFollowData>
              Points: {updateUserData.points ? updateUserData.points : "0"}
            </UserFollowData>
            <ProfileBio>
              {updateUserData.bio
                ? updateUserData.bio
                : "👩‍💻 Passionate Developer | Creating Innovative Solutions | Love for Coding and Problem Solving | Let's Build Something Amazing! 🚀"}
            </ProfileBio>
          </ProfileData>
          <Buttons>
            <Btn
              isDarkMode={isDarkMode}
              isCurrentUser={updateUserData.uid === currentUser.uid}
            >
              Follow
            </Btn>
            {/* <Btn isDarkMode={isDarkMode}>Message</Btn> */}
            {updateUserData.uid === currentUser.uid && (
              <EditProfileBtn
                isDarkMode={isDarkMode}
                onClick={() => navigate("/user/profile/editprofile")}
              >
                Edit Profile
              </EditProfileBtn>
            )}
            {updateUserData.uid === currentUser.uid && (
              <LogoutBtn
                isDarkMode={isDarkMode}
                onClick={() => {
                  signOut(auth);
                  navigate("/");
                }}
              >
                Logout
              </LogoutBtn>
            )}
          </Buttons>
        </ProfileBtn>
      </Card>
      <UserProfileData>
        <UserSmallInfo isDarkMode={isDarkMode}>
          <Title>Personal Information </Title>
          <PersonalInfoDiv isDarkMode={isDarkMode}>
            <UserData isDarkMode={isDarkMode}>
              <DataTitle>Email </DataTitle>
              <Data>
                {updateUserData.email
                  ? updateUserData.email
                  : "Email not added!!"}
              </Data>
            </UserData>
            <UserData isDarkMode={isDarkMode}>
              <DataTitle>Location </DataTitle>
              <Data>
                {updateUserData.location ? updateUserData.location : "-"}
              </Data>
            </UserData>
            <UserData isDarkMode={isDarkMode}>
              <DataTitle>Gender </DataTitle>
              <Data>{updateUserData.gender ? updateUserData.gender : "-"}</Data>
            </UserData>
            <UserData isDarkMode={isDarkMode}>
              <DataTitle>Birth Date </DataTitle>
              <Data>
                {updateUserData.birthDate ? updateUserData.birthDate : "-"}
              </Data>
            </UserData>
            <UserData isDarkMode={isDarkMode}>
              <DataTitle>Work </DataTitle>
              <Data>
                {updateUserData.currentWorkplace
                  ? updateUserData.currentWorkplace
                  : "-"}
              </Data>
            </UserData>
          </PersonalInfoDiv>
        </UserSmallInfo>

        <UserSkillsInfo isDarkMode={isDarkMode}>
          {updateUserData.skills || updateUserData.githubUsername ? (
            <>
              <Title>Skills </Title>
              <AllLangDiv>
                {updateUserData.skills.map((language) => (
                  <LangDiv key={language} isDarkMode={isDarkMode}>
                    {language}
                    <span ref={iconContainerRef}></span>
                    {/* Container for the icon */}
                  </LangDiv>
                ))}
                {languages.map((language) => (
                  <LangDiv key={language} isDarkMode={isDarkMode}>
                    {language}
                    <span ref={iconContainerRef}></span>
                    {/* Container for the icon */}
                  </LangDiv>
                ))}
              </AllLangDiv>
            </>
          ) : null}
          {updateUserData.githubUsername ? <Title>Projects </Title> : null}
          {updateUserData.githubUsername ? (
            <AllReposDiv>
              {repos.map((repo) => (
                <RepoDiv key={repo.name} isDarkMode={isDarkMode}>
                  <RepoName isDarkMode={isDarkMode}>{repo.name}</RepoName>
                  <RepoBtn isDarkMode={isDarkMode} href={repo.url}>
                    View Repo
                  </RepoBtn>
                </RepoDiv>
              ))}
            </AllReposDiv>
          ) : (
            <NoGithubAddedDiv isDarkMode={isDarkMode}>
              Github Profile Not Added
            </NoGithubAddedDiv>
          )}
        </UserSkillsInfo>
      </UserProfileData>
      <UserCodeReview />
      <Outlet />
    </ProfileDiv>
  );
}

export default Profile;

const ProfileDiv = styled.div`
  width: 100%;
  height: 90vh;
  overflow: auto;
  display: flex;
  flex-direction: column;
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

const Card = styled.div`
  width: 100%;
  background: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.primary
      : (props) => props.theme.light.primary};
  border-radius: 5px;
  /* box-shadow: 0 10px 15px rgba(0, 0, 0, 0.7); */
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const CoverPhoto = styled.div`
  position: relative;
  background: ${(props) => props.gradient(props.displayName + props.uid)};

  background-size: cover;
  height: 12vh;
  border-radius: 5px 5px 0 0;

  & img {
    position: absolute;
    width: 120px;
    bottom: -60px;
    left: 15px;
    border-radius: 50%;
    border: 1px solid
      ${(props) =>
        props.isDarkMode
          ? (props) => props.theme.dark.primary
          : (props) => props.theme.light.primary};
    background: ${(props) =>
      props.isDarkMode
        ? (props) => props.theme.dark.primary
        : (props) => props.theme.light.primary};
    padding: 5px;
  }
  @media (max-width: 768px) {
    height: 15vh;
    & img {
      width: 100px;
      bottom: -50px;
      left: 10px;
    }
  }
`;

const ProfileName = styled.h3`
  font-size: 30px;
  margin: 0 0 0 150px;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  padding: 12px;
  @media (max-width: 768px) {
    margin: 10px 0 0 10px;
  }
`;

const ProfileBio = styled.div`
  padding: 0 0 12px 12px;
  font-size: 1.2rem;
`;

const Btn = styled.button`
  margin: 10px 15px 0 0;
  padding: 10px 25px;
  border-radius: 3px;
  border: 1px solid ${(props) => props.theme.mainColor};
  font-weight: bold;
  cursor: pointer;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  transition: 0.2s;
  background: transparent;
  display: ${(props) => (props.isCurrentUser ? "none" : "block")};
  &:hover {
    background: ${(props) => props.theme.mainColor};
  }
`;

const ProfileBtn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

// const Logo = styled.a`
//   font-size: 24px;
//   font-weight: bold;
//   text-decoration: none;
//   color: #fff;
//   margin-right: 20px;

//   &:hover {
//     color: #fff;
//     background-color: transparent;
//   }
// `;

// const SpecialLink = styled.a`;
//   color: #fff;
//   text-decoration: none;
//   margin: 0 20px;
//   padding: 10px;
//   transition: color 0.3s, background-color 0.3s;
//   animation: ${bounce} 1s infinite;

//   &:hover {
//     color: #333;
//     background-color: #fff;
//   }
// `;

const EditProfileBtn = styled(Btn)``;

const LogoutBtn = styled(Btn)``;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
`;

const ProfileData = styled.div`
  display: flex;
  flex-direction: column;
  /* align-items: center; */
  justify-content: center;
`;

const UserFollowData = styled.div`
  margin: 0 0 12px 150px;
  font-size: 1.1rem;
`;

const UserSmallInfo = styled.div`
  width: 30%;
  margin: 12px;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const Title = styled.p`
  font-size: 1.6rem;
  font-weight: bold;
  margin: 0;
`;

const PersonalInfoDiv = styled.div`
  /* background: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.primary
      : (props) => props.theme.light.primary};
  border-radius: 5px; */

  margin: 12px 0;
`;

const UserData = styled.div`
  display: flex;
  flex-direction: column;
  background: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.primary
      : (props) => props.theme.light.primary};
  border-radius: 5px;
  padding: 0 12px;
  margin-top: 12px;
`;

const DataTitle = styled.p`
  margin: 12px 0 0 0;
  font-size: 1.1rem;
  opacity: 0.7;
`;

const Data = styled.p`
  margin: 12px 0;
  font-size: 1.3rem;
`;

const UserProfileData = styled.div`
  width: 98%;
  display: flex;
`;

const UserSkillsInfo = styled.div`
  width: 70%;
  margin: 12px;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const LangDiv = styled.div`
  width: 12rem;
  /* width: 100px; */
  background: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.primary
      : (props) => props.theme.light.primary};
  border-radius: 5px;
  padding: 12px;
  margin-top: 12px;
  text-align: center;
  font-size: 1.3rem;
`;

const AllLangDiv = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
`;

const UserProjectsDiv = styled.div`
  width: 10%;
  margin: 12px;
  background-color: red;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const AllReposDiv = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
`;

const RepoDiv = styled.div`
  background: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.primary
      : (props) => props.theme.light.primary};
  color: ${(props) => (props.isDarkMode ? "#fff" : "#333")};
  border-radius: 5px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const RepoName = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0;
`;

const RepoBtn = styled.a`
  background-color: ${(props) => (props.isDarkMode ? "#555" : "#ccc")};
  color: ${(props) => (props.isDarkMode ? "#fff" : "#333")};
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: background-color 0.3s;
  text-decoration: none;
  &:hover {
    background-color: ${(props) => (props.isDarkMode ? "#444" : "#ddd")};
  }
`;
const NoGithubAddedDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${(props) => (props.isDarkMode ? "#fff" : "#333")};
  font-size: 2.3rem;
  margin: 12px;
  text-align: center;
  font-weight: bold;
  background: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.primary
      : (props) => props.theme.light.primary};
  border-radius: 5px;
  padding: 12px;
`;
