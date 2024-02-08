import React, { useContext, useState } from "react";
import styled from "styled-components";
import BoyCodeImg from "../images/BoyCodeImg.png";
import GirlCodeImg from "../images/GirlCodeImg.png";
import { ThemeContext } from "../App";

function Courses() {
  const { isDarkMode } = useContext(ThemeContext);
  const [activeOption, setActiveOption] = useState("AllTopics");
  return (
    <CoursesDiv>
      <TitleDiv isDarkMode={isDarkMode}>
        <SideImg src={BoyCodeImg} />
        <CourseTitle isDarkMode={isDarkMode}>
          Code Crafters Courses Library
        </CourseTitle>
        <SideImg src={GirlCodeImg} />
      </TitleDiv>
      <OptionsDiv>
        <Option
          activeOption={activeOption === "AllTopics"}
          onClick={() => setActiveOption("AllTopics")}
        >
          All Topics
        </Option>
        <Option
          activeOption={activeOption === "HTML"}
          onClick={() => setActiveOption("HTML")}
        >
          HTML
        </Option>
        <Option
          activeOption={activeOption === "CSS"}
          onClick={() => setActiveOption("CSS")}
        >
          CSS
        </Option>
        <Option
          activeOption={activeOption === "Javascript"}
          onClick={() => setActiveOption("Javascript")}
        >
          Javascript
        </Option>
        <Option
          activeOption={activeOption === "React"}
          onClick={() => setActiveOption("React")}
        >
          React
        </Option>
        <Option
          activeOption={activeOption === "Popular"}
          onClick={() => setActiveOption("Popular")}
        >
          Popular
        </Option>
      </OptionsDiv>
    </CoursesDiv>
  );
}

export default Courses;

const CoursesDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const TitleDiv = styled.div`
  background-color: ${(props) => (props.isDarkMode ? "#1A2731" : "#D8D9DA")};
  width: 100%;
  height: 200px;
  /* border-radius: 5px; */
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CourseTitle = styled.p`
  margin: 0;
  text-align: center;
  font-size: 3rem;
  color: ${(props) => (props.isDarkMode ? "white" : "black")};
  font-weight: bold;
`;

const SideImg = styled.img`
  width: 15%;
`;

const OptionsDiv = styled.div`
  display: flex;

  margin-top: 12px;
  justify-content: space-around;
`;

const Option = styled.div`
  border: 1px solid white;
  font-size: 1.5rem;
  color: white;
  width: 10%;
  padding: 12px;
  text-align: center;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${(props) =>
    props.activeOption ? (props) => props.theme.mainColor : "transparent"};
`;
