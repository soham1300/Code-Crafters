import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { ThemeContext } from "../App";
import { TbBrandPython } from "react-icons/tb";
import { DiJavascript1 } from "react-icons/di";
import { SiCplusplus, SiC } from "react-icons/si";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";
import Rating from "@mui/material/Rating";
import { useNavigate } from "react-router-dom";

function Challenges(props) {
  const { isDarkMode } = useContext(ThemeContext);
  const [isActive, setIsActive] = useState("all");
  const [challenges, setChallenges] = useState([]);
  const [lastDoc, setLastDoc] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const fetchData = async () => {
        const first = query(
          collection(db, "challenges"),
          orderBy("title"),
          limit(5)
        );
        const documentSnapshots = await getDocs(first);

        // Get last visible document
        setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

        // Get data for first 10 documents
        setChallenges(
          documentSnapshots.docs.map((doc) => [doc.data(), doc.id])
        );
      };
      fetchData();
    } catch {
      props.toast.error("Something went wrong");
    }
  }, []);
  console.log(challenges);
  // Load more reviews
  const loadMore = async () => {
    try {
      const next = query(
        collection(db, "codeReview"),
        orderBy("timestamp", "desc"),
        startAfter(lastDoc),
        limit(5)
      );
      const documentSnapshots = await getDocs(next);

      // Get last document
      setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

      // Append to existing reviews
      setChallenges((prevReviews) => [
        ...prevReviews,
        ...documentSnapshots.docs.map((doc) => [doc.data(), doc.id]),
      ]);
    } catch {
      props.toast("No more code reviews available");
    }
  };
  if (!challenges) {
    return <div>Loading...</div>;
  }

  function ChallengeCard({
    isDarkMode,
    title,
    difficulty,
    lang,
    id,
    challenge,
  }) {
    return (
      <ChallengeSection
        isDarkMode={isDarkMode}
        onClick={() => {
          props.setSelectChallenge(challenge);
          navigate(`/user/codingchallenges/${id}`);
        }}
      >
        <ChallengeTitle>{title}</ChallengeTitle>
        <ChallengeInfo>
          Language: {lang}, Reward: {difficulty * 5} points
        </ChallengeInfo>
        <ChallengeDifficulty>
          Difficulty: <Rating name="read-only" value={difficulty} readOnly />
        </ChallengeDifficulty>
      </ChallengeSection>
    );
  }

  return (
    <ChallengesDiv isDarkMode={isDarkMode}>
      <SelectLang>
        <SelectLangTitle>Select Language</SelectLangTitle>
        <SelectLangSection>
          <SelectlangSelect
            isActive={isActive === "all"}
            onClick={() => setIsActive("all")}
            isDarkMode={isDarkMode}
          >
            All
          </SelectlangSelect>
          <SelectlangSelect
            isActive={isActive === "c"}
            onClick={() => setIsActive("c")}
            isDarkMode={isDarkMode}
          >
            <SiC size={25} />
            <>C Language</>
          </SelectlangSelect>
          <SelectlangSelect
            isActive={isActive === "c++"}
            onClick={() => setIsActive("c++")}
            isDarkMode={isDarkMode}
          >
            <SiCplusplus size={25} />
            C++
          </SelectlangSelect>
          <SelectlangSelect
            isActive={isActive === "js"}
            onClick={() => setIsActive("js")}
            isDarkMode={isDarkMode}
          >
            <DiJavascript1 size={25} />
            Javascript
          </SelectlangSelect>
          <SelectlangSelect
            isActive={isActive === "py"}
            onClick={() => setIsActive("py")}
            isDarkMode={isDarkMode}
          >
            <TbBrandPython size={25} />
            Python
          </SelectlangSelect>
        </SelectLangSection>
      </SelectLang>
      <ChallengesList>
        <ChallengesListTitle>Challenges</ChallengesListTitle>
        {challenges.map((challenge, index) => {
          if (isActive === "all") {
            return (
              <ChallengeCard
                isDarkMode={isDarkMode}
                title={challenge[0].title}
                difficulty={challenge[0].difficulty}
                lang={challenge[0].lang}
                id={challenge[1]}
                challenge={challenge[0]}
                key={index}
              />
            );
          } else if (isActive === challenge[0].lang) {
            return (
              <ChallengeCard
                isDarkMode={isDarkMode}
                title={challenge[0].title}
                difficulty={challenge[0].difficulty}
                lang={challenge[0].lang}
                id={challenge[1]}
                key={index}
              />
            );
          }
        })}
      </ChallengesList>
      {challenges.length > 0 && challenges.length % 5 === 0 && (
        <LoadMoreBtn onClick={loadMore} isDarkMode={isDarkMode}>
          Load More
        </LoadMoreBtn>
      )}
    </ChallengesDiv>
  );
}

export default Challenges;

const ChallengesDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
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
const SelectLang = styled.div`
  width: 20%;
  padding: 20px;
`;

const SelectLangTitle = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const SelectLangSection = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
`;

const SelectlangSelect = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
  justify-content: center;
  padding: 20px 25%;
  border: 1px solid
    ${(props) =>
      props.isDarkMode
        ? (props) => props.theme.dark.text
        : (props) => props.theme.light.text};
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) =>
    props.isActive ? (props) => props.theme.mainColor : "transparent"};
  &:hover {
    border: 1px solid ${(props) => props.theme.mainColor};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
  }
`;

const ChallengesList = styled.div`
  padding: 20px;
`;

const ChallengesListTitle = styled.p`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ChallengeSection = styled.div`
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.primary
      : (props) => props.theme.light.primary};
  color: ${(props) =>
    props.isDarkMode ? props.theme.dark.text : props.theme.light.text};
  padding: 8px;
  margin: 10px 0;
  border-radius: 4px;
  /* border: 1px solid
    ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text}; */
  border: none;
  box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.75);
  &:hover {
    border: 1px solid ${(props) => props.theme.mainColor};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
  }
  /* box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2); */
  cursor: pointer;
`;

const ChallengeTitle = styled.div`
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
`;

const ChallengeDifficulty = styled.div`
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
`;

const LoadMoreBtn = styled.button`
  margin: 10px;
  padding: 10px 20px;
  border-radius: 5px;
  height: 7vh;
  width: 8vw;
  background-color: ${(props) =>
    props.isEnterCode ? (props) => props.theme.mainColor : "transparent"};
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  border: 2px solid
    ${(props) =>
      props.isDarkMode
        ? (props) => props.theme.dark.text
        : (props) => props.theme.light.text};
  &:hover {
    cursor: pointer;
    border: 2px solid ${(props) => props.theme.mainColorHover};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
    background-color: ${(props) => props.theme.mainColor};
  }
  @media (max-width: 768px) {
    height: auto;
    width: auto;
    margin: 0 30vw;
  }
`;

const ChallengeInfo = styled.div`
  opacity: 0.7;
`;
