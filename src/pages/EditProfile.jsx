import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { ThemeContext } from "../App";
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, storage } from "../DB/FirebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { FaUser } from "react-icons/fa";

function EditProfile({ toast }) {
  const { isDarkMode } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [currentWorkplace, setCurrentWorkplace] = useState("");
  const [facebookLink, setFacebookLink] = useState("");
  const [twitterLink, setTwitterLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [error, setError] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [previewProfilePic, setPreviewProfilePic] = useState(null);

  const handleNameChange = (e) => setName(e.target.value);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleBioChange = (e) => setBio(e.target.value);
  const handleGithubUsernameChange = (e) => setGithubUsername(e.target.value);
  const handleNewSkillChange = (e) => setNewSkill(e.target.value);
  const handleLocationChange = (e) => setLocation(e.target.value);
  const handleGenderChange = (e) => setGender(e.target.value);
  const handleBirthdateChange = (e) => setBirthdate(e.target.value);
  const handleCurrentWorkplaceChange = (e) =>
    setCurrentWorkplace(e.target.value);
  const handleFacebookLinkChange = (e) => setFacebookLink(e.target.value);
  const handleTwitterLinkChange = (e) => setTwitterLink(e.target.value);
  const handleLinkedinLinkChange = (e) => setLinkedinLink(e.target.value);

  const addSkill = () => {
    if (newSkill.trim() !== "" && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const userDataToUpdate = {
        displayName: name,
        email: email,
        bio: bio,
        githubUsername: githubUsername,
        skills: skills,
        location: location,
        gender: gender,
        birthdate: birthdate,
        currentWorkplace: currentWorkplace,
        facebookLink: facebookLink,
        twitterLink: twitterLink,
        linkedinLink: linkedinLink,
      };

      if (profilePic) {
        // Upload profile picture and get the URL
        // For example, using Firebase Storage
        const storageRef = ref(storage, `users/${currentUser.uid}/profilePic`);
        const snapshot = await uploadBytesResumable(storageRef, profilePic);
        const downloadURL = await getDownloadURL(snapshot.ref);

        // Update the user data with the profile picture URL
        userDataToUpdate.photoURL = downloadURL;
      }

      await updateDoc(doc(db, "users", currentUser.uid), userDataToUpdate);

      toast.success("Profile updated successfully!");
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewProfilePic(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    try {
      const fetchData = async () => {
        const userDataFetch = await getDoc(doc(db, "users", currentUser.uid));
        if (userDataFetch.exists()) {
          const userData = userDataFetch.data();
          setUserData(userData);
          setName(userData.displayName || "");
          setEmail(userData.email || "");
          setBio(userData.bio || "");
          setGithubUsername(userData.githubUsername || "");
          setSkills(userData.skills || []);
          setLocation(userData.location || "");
          setGender(userData.gender || "");
          setBirthdate(userData.birthdate || "");
          setCurrentWorkplace(userData.currentWorkplace || "");
          setFacebookLink(userData.facebookLink || "");
          setTwitterLink(userData.twitterLink || "");
          setLinkedinLink(userData.linkedinLink || "");
          setPreviewProfilePic(userData.photoURL || "");
        }
      };
      fetchData();
    } catch (error) {
      setError(error.message);
    }
  }, [currentUser.uid]);
  if (error) {
    toast.error(error.message);
  }
  if (!userData) {
    return <div>Loading...</div>;
  }
  return (
    <EditProfileDiv isDarkMode={isDarkMode}>
      <TitleDiv isDarkMode={isDarkMode}>Edit Profile</TitleDiv>
      <FormDiv onSubmit={handleSubmit}>
        <SectionTitle>Personal Information</SectionTitle>
        <ProfilePicContainerWrapper>
          <ProfilePicContainer>
            {previewProfilePic ? (
              <ProfilePic src={previewProfilePic} alt="Profile" />
            ) : (
              <DefaultProfilePic>
                <FaUser />
              </DefaultProfilePic>
            )}
            <ProfilePicInput
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
            />
          </ProfilePicContainer>
        </ProfilePicContainerWrapper>

        <InputField
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="Name"
          isDarkMode={isDarkMode}
        />
        <InputField
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Email"
          isDarkMode={isDarkMode}
        />
        <InputField
          type="text"
          value={bio}
          onChange={handleBioChange}
          placeholder="Bio"
          isDarkMode={isDarkMode}
        />
        <InputField
          type="text"
          value={githubUsername}
          onChange={handleGithubUsernameChange}
          placeholder="GitHub Username"
          isDarkMode={isDarkMode}
        />
        <SkillsSection>
          <SectionTitle>Skills</SectionTitle>

          <SkillInputContainer>
            <InputField
              type="text"
              value={newSkill}
              onChange={handleNewSkillChange}
              placeholder="Add a skill"
              isDarkMode={isDarkMode}
            />
            <AddSkillButton
              type="button"
              onClick={addSkill}
              isDarkMode={isDarkMode}
            >
              <PlusIcon>+</PlusIcon>
            </AddSkillButton>
          </SkillInputContainer>
          <SkillsList>
            {skills.map((skill, index) => (
              <Skill key={index} isDarkMode={isDarkMode}>
                {skill}
                <RemoveSkillButton onClick={() => removeSkill(skill)}>
                  X
                </RemoveSkillButton>
              </Skill>
            ))}
          </SkillsList>
        </SkillsSection>
        <SectionTitle>Additional Information</SectionTitle>
        <InputField
          type="text"
          value={location}
          onChange={handleLocationChange}
          placeholder="Location"
          isDarkMode={isDarkMode}
        />
        <InputField
          type="text"
          value={gender}
          onChange={handleGenderChange}
          placeholder="Gender"
          isDarkMode={isDarkMode}
        />
        <InputField
          type="date"
          value={birthdate}
          onChange={handleBirthdateChange}
          placeholder="Birthdate"
          isDarkMode={isDarkMode}
        />
        <InputField
          type="text"
          value={currentWorkplace}
          onChange={handleCurrentWorkplaceChange}
          placeholder="Current Workplace"
          isDarkMode={isDarkMode}
        />
        <SectionTitle>Social Media Links</SectionTitle>
        <InputField
          type="text"
          value={facebookLink}
          onChange={handleFacebookLinkChange}
          placeholder="Facebook Link"
          isDarkMode={isDarkMode}
        />
        <InputField
          type="text"
          value={twitterLink}
          onChange={handleTwitterLinkChange}
          placeholder="Twitter Link"
          isDarkMode={isDarkMode}
        />
        <InputField
          type="text"
          value={linkedinLink}
          onChange={handleLinkedinLinkChange}
          placeholder="LinkedIn Link"
          isDarkMode={isDarkMode}
        />
        <br />
        <SubmitButtonWrapper>
          <SubmitButton isDarkMode={isDarkMode}>Save Changes</SubmitButton>
        </SubmitButtonWrapper>
      </FormDiv>
    </EditProfileDiv>
  );
}

export default EditProfile;

const EditProfileDiv = styled.div`
  color: ${(props) => (props.isDarkMode ? "#FFFFFF" : "#000000")};
`;

const TitleDiv = styled.div`
  font-size: 24px;
  font-weight: bold;
  padding: 20px;
  background-color: ${(props) => (props.isDarkMode ? "#1A2731" : "#FFFFFF")};
  margin: 0;
`;

const SectionTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
  margin-bottom: 10px;
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

const SkillsSection = styled.div`
  margin-top: 20px;
`;

const SkillsList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const Skill = styled.li`
  display: inline-block;
  border: solid 1px #5e5e5e;
  border-radius: 5px;
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.secondry
      : (props) => props.theme.light.secondry};
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  padding: 10px;
  margin-right: 5px; // Add margin between skills
`;

const RemoveSkillButton = styled.button`
  background: none;
  border: none;
  color: red;
  cursor: pointer;
`;

const SkillInputContainer = styled.div`
  display: flex;
  margin-top: 8px;
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

const FormDiv = styled.form`
  padding: 0 20px;
`;

const AddSkillButton = styled.button`
  width: 50px;
  height: 50px;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
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
`;

// CSS for the icon inside the button
const PlusIcon = styled.span`
  font-size: 20px;
`;

const ProfilePicContainerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center; /* Center children horizontally */
`;

const ProfilePicContainer = styled.div`
  position: relative;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20px;
`;

const ProfilePic = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const DefaultProfilePic = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  background-color: #f0f0f0;
`;

const ProfilePicInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

// const ProfilePicLabel = styled.label`
//   position: absolute;
//   bottom: 10px;
//   left: 50%;
//   transform: translateX(-50%);
//   cursor: pointer;
//   color: #007bff;
//   text-decoration: underline;
// `;
