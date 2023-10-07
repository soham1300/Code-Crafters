import React, { useState, useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "../App";
import Select from "react-select";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";

function AddChallenges() {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedOption, setSelectedOption] = useState(null);
  const [textareaValue, setTextareaValue] = useState("");
  const [OP, setOP] = useState("");
  const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "c++", label: "C++" },
    { value: "java", label: "Java" },
  ];

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const clickSubmit = async () => {
    if (selectedOption && textareaValue && OP) {
      try {
        await addDoc(collection(db, "challenges"), {
          lang: selectedOption,
          description: textareaValue,
          output: OP,
        });
      } catch (e) {
        // Handle the error
      }
    } else {
      // Handle validation error
    }
  };

  return (
    <AddChallengesContainer isDarkMode={isDarkMode}>
      <Title>Add Coding Challenges</Title>
      <SelectContainer>
        <Label>Select Language:</Label>
        <Select
          options={languages}
          value={selectedOption}
          onChange={handleSelectChange}
        />
      </SelectContainer>
      <InputContainer>
        <Label>Title:</Label>
        <Input
          type="text"
          placeholder="Enter title"
          value={OP}
          onChange={(e) => setOP(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <Label>Description:</Label>
        <Textarea
          rows="4"
          cols="50"
          name="comment"
          placeholder="Enter description"
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
        />
      </InputContainer>
      <InputContainer>
        <Label>Output:</Label>
        <Input
          type="text"
          placeholder="Enter Expected Output"
          value={OP}
          onChange={(e) => setOP(e.target.value)}
        />
      </InputContainer>
      <SubmitButton onClick={clickSubmit}>Submit</SubmitButton>
    </AddChallengesContainer>
  );
}

export default AddChallenges;

const AddChallengesContainer = styled.div`
  width: 100%;
`;

const Title = styled.h2`
  text-align: center;
  color: ${(props) =>
    props.isDarkMode ? props.theme.dark.text : props.theme.light.text};
`;

const SelectContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
`;

const Label = styled.label`
  font-size: 20px;
  color: ${(props) =>
    props.isDarkMode ? props.theme.dark.text : props.theme.light.text};
  margin-bottom: 8px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 20px;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 16px;
  border: 2px solid
    ${(props) =>
      props.isDarkMode ? props.theme.dark.text : props.theme.light.text};
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s;
  background-color: transparent;
  color: ${(props) =>
    props.isDarkMode ? props.theme.dark.text : props.theme.light.text};
  &:focus {
    border-color: ${(props) => props.theme.mainColor};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
  }
  &::placeholder {
    color: #999;
  }
`;

const Textarea = styled.textarea`
  padding: 10px;
  font-size: 16px;
  border: 2px solid
    ${(props) =>
      props.isDarkMode ? props.theme.dark.text : props.theme.light.text};
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s;
  background-color: transparent;
  color: ${(props) =>
    props.isDarkMode ? props.theme.dark.text : props.theme.light.text};
  &:focus {
    border-color: ${(props) => props.theme.mainColor};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
  }
  &::placeholder {
    color: #999;
  }
`;

const SubmitButton = styled.button`
  margin: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.isEnterCode ? props.theme.mainColor : "transparent"};
  color: ${(props) =>
    props.isDarkMode ? props.theme.dark.text : props.theme.light.text};
  border: 2px solid
    ${(props) =>
      props.isDarkMode ? props.theme.dark.text : props.theme.light.text};

  &:hover {
    cursor: pointer;
    border: 2px solid ${(props) => props.theme.mainColorHover};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
    background-color: ${(props) => props.theme.mainColor};
  }
`;
