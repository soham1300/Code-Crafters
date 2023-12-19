import React from "react";
import styled from "styled-components";
import gradient from "random-gradient";
import { useContext } from "react";
import { ThemeContext } from "../App";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";
import { db } from "../DB/FirebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

function UserProfileCard({ userData, isAdmin }) {
  const navigate = useNavigate();
  const user = userData;
  const { isDarkMode } = useContext(ThemeContext);

  const handleRemoveUser = async (userId) => {
    try {
      await updateDoc(doc(db, "users", userId), {
        ban: true,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Card isDarkMode={isDarkMode}>
      <CoverPhoto
        gradient={gradient}
        displayName={user.displayName}
        isDarkMode={isDarkMode}
        uid={user.uid}
      >
        <img src={user.photoURL} alt={user.displayName} />
      </CoverPhoto>
      <ProfileName isDarkMode={isDarkMode}>{user.displayName} </ProfileName>
      <About>{user.userType === "working" ? "Professional" : "Studying"}</About>
      <Btn
        isDarkMode={isDarkMode}
        onClick={() => {
          isAdmin
            ? navigate(`/admin/${user.uid}`)
            : navigate(`/user/profile/${user.uid}`);
        }}
      >
        {" "}
        View{" "}
      </Btn>
      {isAdmin ? (
        <Popup
          trigger={<RemoveBtn isDarkMode={isDarkMode}>Ban</RemoveBtn>}
          modal
          nested
        >
          {(close) => (
            <Modal>
              <CloseButton onClick={close}>&times;</CloseButton>
              <Content>Are you sure you want to remove the user. </Content>
              <Actions>
                <RemoveBtn
                  isDarkMode={isDarkMode}
                  onClick={() => {
                    handleRemoveUser(user.uid);
                    close();
                  }}
                >
                  Remove
                </RemoveBtn>
                <CloseBtn
                  onClick={() => {
                    close();
                  }}
                >
                  Close
                </CloseBtn>
              </Actions>
            </Modal>
          )}
        </Popup>
      ) : (
        <Btn isDarkMode={isDarkMode}>Following</Btn>
      )}
      {/* <Icons>
        <i className="fa-brands fa-linkedin"></i>
        <i className="fa-brands fa-github"></i>
        <i className="fa-brands fa-youtube"></i>
        <i className="fa-brands fa-twitter"></i>
      </Icons> */}
    </Card>
  );
}

export default UserProfileCard;

const Card = styled.div`
  padding: 15px;
  margin: 15px;
  width: 300px;
  background: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.secondry
      : (props) => props.theme.light.secondry};
  border-radius: 5px;
  text-align: center;
  /* border: 1px solid
    ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text}; */
  border: none;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const CoverPhoto = styled.div`
  position: relative;
  background: ${(props) => props.gradient(props.displayName + props.uid)};

  background-size: cover;
  height: 10vh;
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
  font-size: 20px;
  margin: 25px 0 0 120px;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const About = styled.p`
  margin-top: 30px;
  line-height: 1.6;
`;

const Btn = styled.button`
  margin: 15px 15px;
  background: ${(props) => props.theme.mainColor};
  padding: 10px 25px;
  border-radius: 3px;
  border: 1px solid
    ${(props) =>
      props.isDarkMode
        ? (props) => props.theme.dark.text
        : (props) => props.theme.light.text};
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

const RemoveBtn = styled.button`
  margin: 15px 15px;
  background: #dc3545;
  padding: 10px 25px;
  border-radius: 3px;
  border: 1px solid
    ${(props) =>
      props.isDarkMode
        ? (props) => props.theme.dark.text
        : (props) => props.theme.light.text};
  font-weight: bold;
  font-family: Montserrat;
  cursor: pointer;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  transition: 0.2s;
  &:hover {
    background: #bd2130;
  }
`;

const Modal = styled.div`
  font-size: 12px;
  background: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.primary
      : (props) => props.theme.light.primary};
  opacity: 0.9;
  border-radius: 15px;
`;

const Content = styled.div`
  width: 100%;
  font-size: 18px;
  padding: 20px;
`;

const Actions = styled.div`
  width: 100%;
  padding: 10px 5px;
  margin: auto;
  text-align: center;
`;

const CloseButton = styled.button`
  cursor: pointer;
  position: absolute;
  display: block;
  padding: 2px 5px;
  line-height: 20px;
  right: -10px;
  top: -10px;
  font-size: 24px;
  background: #ffffff;
  border-radius: 18px;
  border: 1px solid #cfcece;
`;

const CloseBtn = styled(RemoveBtn)`
  background-color: transparent;
  &:hover {
    background-color: #198754;
  }
`;
