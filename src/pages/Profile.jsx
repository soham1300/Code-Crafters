import React, { useEffect, useContext } from "react";
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

function Profile({ toast }) {
  const params = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const { userData, updateUser } = useContext(UserContext);
  const userId = params.userId;
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    try {
      const fetchData = async () => {
        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        //   console.log(doc.id, " => ", doc.data());
        //   console.log("UserProfile");
        //   updateUser(doc.data());
        // });
        const userData = await getDoc(doc(db, "users", userId));
        updateUser(userData.data());
      };
      fetchData();
    } catch (error) {
      toast.error("Error getting documents: ", error);
    }
  }, [userId]);
  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileDiv>
      <Card isDarkMode={isDarkMode}>
        <CoverPhoto
          gradient={gradient}
          displayName={userData.displayName}
          isDarkMode={isDarkMode}
          uid={userData.uid}
        >
          <img src={userData.photoURL} alt={userData.displayName} />
        </CoverPhoto>
        <ProfileBtn>
          <ProfileName isDarkMode={isDarkMode}>
            {userData.displayName}
          </ProfileName>
          <Buttons>
            <Btn
              isDarkMode={isDarkMode}
              isCurrentUser={userData.uid === currentUser.uid}
            >
              Follow
            </Btn>
            {/* <Btn isDarkMode={isDarkMode}>Message</Btn> */}
            {userData.uid === currentUser.uid && (
              <EditProfileBtn isDarkMode={isDarkMode}>
                Edit Profile
              </EditProfileBtn>
            )}
            {userData.uid === currentUser.uid && (
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
        <NavbarWrapper isDarkMode={isDarkMode}>
          <NavbarLink
            isDarkMode={isDarkMode}
            className={
              location.pathname === `/user/profile/${params.userId}`
                ? "active"
                : ""
            }
            onClick={() => navigate(`/user/profile/${params.userId}`)}
          >
            Info
          </NavbarLink>
          <NavbarLink
            isDarkMode={isDarkMode}
            className={
              location.pathname === `/user/profile/${params.userId}/codereview`
                ? "active"
                : ""
            }
            onClick={() =>
              navigate(`/user/profile/${params.userId}/codereview`)
            }
          >
            Code Reviews
          </NavbarLink>
          <NavbarLink
            href="#"
            isDarkMode={isDarkMode}
            className={
              location.pathname === `/user/profile/${params.userId}/challenges`
                ? "active"
                : ""
            }
          >
            Challenges
          </NavbarLink>
          <NavbarLink href="#" isDarkMode={isDarkMode}>
            Contact
          </NavbarLink>
          <NavbarLink href="#" isDarkMode={isDarkMode}>
            Special
          </NavbarLink>
        </NavbarWrapper>
      </Card>
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
  height: 20vh;
  border-radius: 5px 5px 0 0;

  & img {
    position: absolute;
    width: 120px;
    bottom: -60px;
    left: 15px;
    border-radius: 50%;
    border: 2px solid
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
  margin: 25px 0 0 150px;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  @media (max-width: 768px) {
    margin: 10px 0 0 10px;
  }
`;

const Btn = styled.button`
  margin: 25px 0 0 15px;
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
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const NavbarWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 60px;
  background: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.primary
      : (props) => props.theme.light.primary};
  color: #fff;
`;

const NavbarLink = styled.a`
  padding: 20px 16px;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  transition: 0.3s;
  cursor: pointer;
  text-decoration: none;

  &.active,
  &:hover {
    background: ${(props) =>
      props.isDarkMode
        ? props.theme.dark.secondary
        : props.theme.light.secondary};
    border-bottom: 3px solid ${(props) => props.theme.mainColor};
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
