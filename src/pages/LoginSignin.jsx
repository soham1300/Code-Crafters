import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import Logo from "../components/Logo";
import IsDarkMode from "../components/IsDarkMode";
import Loginimg from "../images/LoginImg.png";
//Firebase imports
import { auth, db } from "../DB/FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../App";
import { AuthContext } from "../context/AuthContext";

function LoginSignin(props) {
  // const [isLogin, setIsLogin] = useState(props.login);
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const downloadURL =
    "https://firebasestorage.googleapis.com/v0/b/codecrafters-6d4fe.appspot.com/o/userlogo.jpg?alt=media&token=f4ab6ae3-0560-47dc-91ea-048a480c551e";
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  const isLogin = props.isLogin;

  useEffect(() => {
    if (currentUser) {
      navigate("/user/home");
    }
  }, [currentUser, navigate]);

  const checkUsername = async () => {
    const usersRef = collection(db, "users");
    const q = await query(usersRef, where("displayName", "==", displayName));
    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
  };

  const handleSubmit = async () => {
    if (!isLogin) {
      const usernameTaken = await checkUsername();
      if (!displayName) {
        return props.toast.error("Username required");
      } else if (usernameTaken) {
        return props.toast.error("Username already exists");
      } else if (!email) {
        return props.toast.error("Email required");
      } else if (!password) {
        return props.toast.error("Passwords required");
      } else if (password.length < 6) {
        return props.toast.error("Paasword must be at least 6 characters");
      } else if (password !== confirmPassword) {
        return props.toast.error("Passwords do not match");
      } else {
        isLogin ? Login() : SignUp();
      }
    } else if (isLogin) {
      if (!email) {
        return props.toast.error("Email required");
      } else if (!password) {
        return props.toast.error("Passwords required");
      } else if (password.length < 6) {
        return props.toast.error("Paasword must be at least 6 characters");
      } else {
        isLogin ? Login() : SignUp();
      }
    }
  };

  const SignUp = async () => {
    // alert("SignUp successful!");
    await createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in
        const user = userCredential.user;
        //Update User Data
        await updateProfile(auth.currentUser, {
          displayName,
          photoURL: downloadURL,
        })
          .then(() => {
            console.log("Success");
          })
          .catch((error) => {
            alert(error);
          });

        //Add User on DB
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          displayName,
          photoURL: downloadURL,
          email,
        });
        // saveLogin(user.uid);
        navigate("/completesignup");
      })
      .catch((error) => {
        props.toast.error(error);
        // ..
      });
  };

  const Login = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        // const user = userCredential.user;
        navigate("/user/home");
        // ...
      })
      .catch((error) => {
        props.toast.error(error.code);
      });
  };

  return (
    <LoginSiginBG isDarkMode={isDarkMode}>
      <Logo />
      <IsDarkModeBtn>
        <IsDarkMode />
      </IsDarkModeBtn>

      <LoginSiginDiv isDarkMode={isDarkMode}>
        <SignupText>
          <LoginImg src={Loginimg} alt="login-image" />
          <h2>
            Blast off 🚀 into orbit and rocket up ⬆️ your coding skills here!
          </h2>
          <SmallText>Let's get coding!</SmallText>
        </SignupText>

        <LoginSiginForm isDarkMode={isDarkMode}>
          {/* Form elements */}
          <Title>{isLogin ? "Login" : "Sign Up"}</Title>
          <UserNameInput
            login={isLogin.toString()}
            onChange={(e) => {
              setDisplayName(e.target.value);
            }}
            name={isLogin === "false" ? "username" : ""}
            required
          />
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
          <ConfirmPasswordinput
            login={isLogin.toString()}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
            name={isLogin === "false" ? "confirmPassword" : ""}
            required
          />
          {/* <LoginBtn onClick={props.isLogin ? Login : SignUp}>
            {props.isLogin ? "Login" : "Sign Up"}
          </LoginBtn> */}
          <LoginBtn
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            {isLogin ? "Login" : "Sign Up"}
          </LoginBtn>
          <IsItLogin
            onClick={() => {
              isLogin ? navigate("/signup") : navigate("/login");
            }}
          >
            {isLogin
              ? "Don't have account? Sign Up"
              : "Already have account? Login"}
          </IsItLogin>
        </LoginSiginForm>
      </LoginSiginDiv>
    </LoginSiginBG>
  );
}

export default LoginSignin;

const LoginSiginBG = styled.div`
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

const LoginSiginDiv = styled.div`
  /* background-color: #29343d; */
  /* background-color: ${({ isDark }) => (isDark ? "#29343d" : "#D8D9DA")}; */
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.primary
      : (props) => props.theme.light.primary};
  height: 75%;
  width: 75%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.5);
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const LoginSiginForm = styled.form`
  width: 50%;
  height: 100%;
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

const SignupText = styled.div`
  width: 80%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  /* padding-left: 100px;
  padding-right: 100px; */
  text-align: center;
  border-radius: 25px 0 0 25px;
  /* background-color: ${({ isDark }) => (isDark ? "#1b2225" : "#c5c6c7")}; */
  @media (max-width: 768px) {
    height: 27%;
    width: 100%;
    border-radius: 25px 25px 0 0;
    font-size: 0.7rem;
  }
`;

const LoginImg = styled.img`
  width: 75%;
  animation: float 3s ease-in-out infinite;

  @keyframes float {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-20px);
    }
    100% {
      transform: translateY(0);
    }
  }
  @media (max-width: 768px) {
    z-index: 5;
    margin-top: -70px;
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

const ConfirmPasswordinput = styled(UserNameInput).attrs({
  type: "password",
  placeholder: "Comfirm Password",
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

const IsItLogin = styled.p`
  margin-top: 20px;
  /* text-align: right; */
  cursor: pointer;
`;

const Title = styled.h2`
  font-size: 2rem;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const SmallText = styled.h3`
  @media (max-width: 768px) {
    display: none;
  }
`;

const IsDarkModeBtn = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;
