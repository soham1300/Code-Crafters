import React, { useState, useContext } from "react";
import styled from "styled-components";
import { ThemeContext } from "../App";
import Select from "react-select";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";
import Rating from "@mui/material/Rating";

function AddChallenges() {
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedOption, setSelectedOption] = useState(null);
  const [textareaValue, setTextareaValue] = useState("");
  const [OP, setOP] = useState("");
  const [title, setTitle] = useState("");
  const [value, setValue] = useState(2);
  const languages = [
    { value: "java", label: "Java" },
    { value: "python3", label: "Python" },
    { value: "cpp", label: "C++" },
    { value: "c", label: "C" },
  ];

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);
  };

  const clickSubmit = async () => {
    if (selectedOption && textareaValue && OP) {
      try {
        await addDoc(collection(db, "challenges"), {
          lang: selectedOption.value,
          description: textareaValue,
          output: OP,
          title: title,
          difficulty: value,
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
      <Title isDarkMode={isDarkMode}>Add Coding Challenges</Title>
      <SelectContainer>
        <Label isDarkMode={isDarkMode}>Select Language:</Label>
        <Select
          options={languages}
          value={selectedOption}
          onChange={handleSelectChange}
        />
      </SelectContainer>
      <InputContainer>
        <Label isDarkMode={isDarkMode}>Title:</Label>
        <Input
          type="text"
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          isDarkMode={isDarkMode}
        />
      </InputContainer>
      <InputContainer>
        <Label isDarkMode={isDarkMode}>Description:</Label>
        <Textarea
          rows="4"
          cols="50"
          name="comment"
          placeholder="Enter description"
          value={textareaValue}
          onChange={(e) => setTextareaValue(e.target.value)}
          isDarkMode={isDarkMode}
        />
      </InputContainer>
      <InputContainer>
        <Label isDarkMode={isDarkMode}>Output:</Label>
        <Input
          type="text"
          placeholder="Enter Expected Output"
          value={OP}
          onChange={(e) => setOP(e.target.value)}
          isDarkMode={isDarkMode}
        />
      </InputContainer>
      <InputContainer>
        <Label isDarkMode={isDarkMode}>Difficulty:</Label>
        <Rating
          name="simple-controlled"
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        />
      </InputContainer>
      <SubmitButton onClick={clickSubmit} isDarkMode={isDarkMode}>
        Submit
      </SubmitButton>
    </AddChallengesContainer>
  );
}

export default AddChallenges;

const AddChallengesContainer = styled.div`
  width: 100%;
  overflow: auto;
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
  overflow: auto;
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
