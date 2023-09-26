import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";
import styled from "styled-components";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import gradient from "random-gradient";
import { useContext } from "react";
import { ThemeContext } from "../App";
import { useUserContext } from "../context/UserContex";

function Profile(props) {
  const params = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const location = useLocation();
  const { userData, updateUser } = useUserContext();

  useEffect(() => {
    async function fetchData() {
      const q = query(
        collection(db, "users"),
        where("displayName", "==", params.userId)
      );
      try {
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data());
          updateUser(doc.data());
        });
      } catch (error) {
        props.toast.error("Error fetching data");
      }
    }
    fetchData();
  }, [params.userId, props, updateUser]);
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
          <Btn isDarkMode={isDarkMode}>Follow</Btn>
        </ProfileBtn>
        <NavbarWrapper isDarkMode={isDarkMode}>
          <NavbarLink
            isDarkMode={isDarkMode}
            className={
              location.pathname === `/user/${params.userId}` ? "active" : ""
            }
            onClick={() => navigate(`/user/${params.userId}`)}
          >
            Info
          </NavbarLink>
          <NavbarLink
            href="#"
            isDarkMode={isDarkMode}
            className={
              location.pathname === `/user/${params.userId}/codereview`
                ? "active"
                : ""
            }
          >
            Code Reviews
          </NavbarLink>
          <NavbarLink
            href="#"
            isDarkMode={isDarkMode}
            className={
              location.pathname === `/user/${params.userId}/challenges`
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
  width: 83vw;
  height: 90vh;
  overflow: auto;
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
`;

const ProfileName = styled.h3`
  font-size: 30px;
  margin: 25px 0 0 150px;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const Btn = styled.button`
  margin: 25px 0 0 15px;
  background: ${(props) => props.theme.mainColor};
  padding: 10px 25px;
  border-radius: 3px;
  border: 1px solid ${(props) => props.theme.mainColor};
  font-weight: bold;
  font-family: Montserrat;
  cursor: pointer;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  transition: 0.2s;

  &:last-of-type {
    background: transparent;
  }

  &:hover {
    background: ${(props) => props.theme.mainColorHover};
  }
`;

const ProfileBtn = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  @media (max-width: 768px) {
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
