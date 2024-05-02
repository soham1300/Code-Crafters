import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { ThemeContext } from "../App";
import { AuthContext } from "../context/AuthContext";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";

function AddMentor({ toast }) {
  const { isDarkMode } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [expertise, setExpertise] = useState([]);
  const [mentorType, setMentorType] = useState("");
  const [currentJob, setCurrentJob] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [mentorBio, setMentorBio] = useState("");
  const [error, setError] = useState(null);
  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleExpertiseChange = (e) => {
    setExpertise(e.target.value.split(","));
  };

  const handleCurrentJobChange = (e) => {
    setCurrentJob(e.target.value);
  };

  const handleCompanyNameChange = (e) => {
    setCompanyName(e.target.value);
  };

  const handleMentorBioChange = (e) => {
    setMentorBio(e.target.value);
  };

  const handleSubmit = async (e) => {
    // Handle form submission here
    e.preventDefault();
    try {
      const userDataToUpdate = {
        displayName: name,
        email: email,
        expertise: expertise,
        mentorType: mentorType,
        currentJob: currentJob,
        currentWorkplace: companyName,
        mentorBio: mentorBio,
      };
      await updateDoc(doc(db, "users", currentUser.uid), userDataToUpdate);
      toast.success("Profile updated successfully");
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() => {
    try {
      const fetchData = async () => {
        const userDataFetch = await getDoc(doc(db, "users", currentUser.uid));
        if (userDataFetch.exists()) {
          const userData = userDataFetch.data();
          setName(userData.displayName || "");
          setEmail(userData.email || "");
          setMentorBio(userData.mentorBio || "");
          setExpertise(userData.expertise || "");
          setMentorType(userData.mentorType || []);
          setCurrentJob(userData.currentJob || "");
          setCompanyName(userData.currentWorkplace || "");
        }
      };
      fetchData();
    } catch (error) {
      setError(error.message);
    }
  }, [currentUser.uid]);

  if (error) {
    toast.error(error);
  }

  return (
    <AddMentorDiv>
      <TitleDiv isDarkMode={isDarkMode}>
        <>Become a Mentor</>
      </TitleDiv>
      <InputContainer>
        <InputLabel isDarkMode={isDarkMode}>Name</InputLabel>
        <InputField
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Name"
          isDarkMode={isDarkMode}
        />
      </InputContainer>
      <InputContainer>
        <InputLabel isDarkMode={isDarkMode}>Email</InputLabel>
        <InputField
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
          isDarkMode={isDarkMode}
        />
      </InputContainer>
      <InputContainer>
        <InputLabel isDarkMode={isDarkMode}>Expertise</InputLabel>
        <InputField
          type="text"
          value={expertise.join(", ")}
          onChange={handleExpertiseChange}
          placeholder="Expertise"
          isDarkMode={isDarkMode}
        />
      </InputContainer>
      <InputContainer>
        <InputLabel isDarkMode={isDarkMode}>Type of mentor</InputLabel>
        <CustomSelect
          value={mentorType}
          onChange={(e) => setMentorType(e.target.value)}
          isDarkMode={isDarkMode}
        >
          <option value="">Select Type</option>
          <option value="Career Guidance">Career Guidance</option>
          <option value="Technical Advice">Technical Advice</option>
          <option value="Project Mentoring">Project Mentoring</option>
        </CustomSelect>
      </InputContainer>
      <InputContainer>
        <InputLabel isDarkMode={isDarkMode}>Current Job Position</InputLabel>
        <InputField
          type="text"
          value={currentJob}
          onChange={handleCurrentJobChange}
          placeholder="Current Job Position"
          isDarkMode={isDarkMode}
        />
      </InputContainer>
      <InputContainer>
        <InputLabel isDarkMode={isDarkMode}>Current Workplace</InputLabel>
        <InputField
          type="text"
          value={companyName}
          onChange={handleCompanyNameChange}
          placeholder="Current Workplace"
          isDarkMode={isDarkMode}
        />
      </InputContainer>
      <InputContainer>
        <InputLabel isDarkMode={isDarkMode}>Mentor Bio</InputLabel>
        <InputField
          type="text"
          value={mentorBio}
          onChange={handleMentorBioChange}
          placeholder="Mentor Bio"
          isDarkMode={isDarkMode}
        />
      </InputContainer>
      <SubmitButtonWrapper>
        <SubmitButton isDarkMode={isDarkMode} onClick={(e) => handleSubmit(e)}>
          Save Changes
        </SubmitButton>
      </SubmitButtonWrapper>
    </AddMentorDiv>
  );
}

export default AddMentor;

const AddMentorDiv = styled.div``;

const TitleDiv = styled.div`
  font-size: 24px;
  font-weight: bold;
  padding: 20px;
  color: ${(props) => (props.isDarkMode ? "#FFFFFF" : "#1A2731")};
  background-color: ${(props) => (props.isDarkMode ? "#1A2731" : "#FFFFFF")};
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const InputField = styled.input`
  width: 90%;
  height: 5vh;
  padding-left: 1vw;
  font-size: 20px;
  /* border-bottom: #cccccc; */
  border: none;
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.secondry
      : (props) => props.theme.light.secondry};
  border: solid 1px #5e5e5e;
  border-radius: 5px;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  margin-bottom: 10px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px 0 0 10px;
`;

const InputLabel = styled.label`
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  font-size: 1.3rem;
  margin-bottom: 5px;
`;
const CustomSelect = styled.select`
  width: 90%;
  height: 5vh;
  padding-left: 1vw;
  font-size: 20px;
  border: none;
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.secondry
      : (props) => props.theme.light.secondry};
  border: solid 1px #5e5e5e;
  border-radius: 5px;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  margin-bottom: 10px;
`;

const SubmitButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.mainColor};
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  border: 2px solid transparent;
  &:hover {
    cursor: pointer;
    border: 2px solid ${(props) => props.theme.mainColorHover};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
  }
`;
