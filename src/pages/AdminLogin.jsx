import React, { useState, useContext } from "react";
import styled from "styled-components";
import Logo from "../components/Logo";
import IsDarkMode from "../components/IsDarkMode";

import { auth } from "../DB/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import validator from "validator";

function LoginSignin(props) {
  // const [isLogin, setIsLogin] = useState(props.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);

  const handleSubmit = async () => {
    if (!email) {
      return props.toast.error("Email required");
    } else if (!password) {
      return props.toast.error("Passwords required");
    } else if (password.length < 6) {
      return props.toast.error("Paasword must be at least 6 characters");
    } else if (!validator.isEmail(email)) {
      return props.toast.error("Email is not proper");
    } else {
      Login();
    }
  };

  const Login = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        // const user = userCredential.user;
        navigate("/admin/users");
        // ...
      })
      .catch((error) => {
        props.toast.error(error.code);
      });
  };

  return (
    <LoginSigninBG isDarkMode={isDarkMode}>
      <Logo />
      <IsDarkModeBtn>
        <IsDarkMode />
      </IsDarkModeBtn>
      <LoginSigninForm isDarkMode={isDarkMode}>
        {/* Form elements */}
        <Title>Admin Login</Title>

        <Emailinput
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          required
        />
        <Passwordinput
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          required
        />

        <LoginBtn
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          Login
        </LoginBtn>
      </LoginSigninForm>
    </LoginSigninBG>
  );
}

export default LoginSignin;

const LoginSigninBG = styled.div`
  height: 100vh;
  width: 100vw;
  /* background-color: #1e2025; */
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.bg
      : (props) => props.theme.light.bg};
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginSigninForm = styled.form`
  width: 30%;
  height: 75%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.secondry
      : (props) => props.theme.light.secondry};
  border-radius: 25px;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.5);
  @media (max-width: 768px) {
    width: 100%;
    height: 73%;
    justify-content: start;
  }
`;

const UserNameInput = styled.input.attrs({
  type: "text",
  placeholder: "Username",
})`
  display: ${({ login }) => (login === "true" ? " none" : "block")};
  width: 65%;
  padding: 12px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  &:focus {
    outline: none;
    border-color: #cccccc;
    box-shadow: 0 0 0 2px #7c7c7c;
  }
  @media (max-width: 768px) {
    width: 75%;
  }
`;

const Emailinput = styled(UserNameInput).attrs({
  type: "email",
  placeholder: "Email",
})`
  margin-top: 20px;
  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const Passwordinput = styled(UserNameInput).attrs({
  type: "password",
  placeholder: "Password",
})`
  margin-top: 20px;
  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const LoginBtn = styled.button.attrs({
  // type: "submit",
})`
  width: 75%;
  margin-top: 20px;
  /* background-color: #f5a623; */
  /* background-color: #663de5; */
  background-color: ${(props) => props.theme.mainColor};
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-style: bold;
  cursor: pointer;
  &:hover {
    /* background-color: #452b96; */
    background-color: ${(props) => props.theme.mainColorHover};
  }
`;

const Title = styled.h2`
  font-size: 2rem;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const IsDarkModeBtn = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;
