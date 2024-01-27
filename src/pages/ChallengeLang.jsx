import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { ThemeContext } from "../App";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
  where,
} from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";
import Rating from "@mui/material/Rating";

function ChallengeLang(props) {
  const params = useParams();
  const { isDarkMode } = useContext(ThemeContext);
  const [challenges, setChallenges] = useState([]);
  const [lastDoc, setLastDoc] = useState();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  var lang;
  var plang;

  console.log(plang);
  switch (params.lang) {
    case "c":
      lang = "C Language";
      plang = "c";
      break;
    case "c++":
      lang = "C++";
      plang = "c++";
      break;
    case "java":
      lang = "Java";
      plang = "java";
      break;
    case "py":
      lang = "Python";
      plang = "py";
      break;
    default:
      lang = null;
  }

  useEffect(() => {
    try {
      const fetchData = async () => {
        const first = query(
          collection(db, "challenges"),
          where("lang", "==", plang),
          limit(5)
        );
        const documentSnapshots = await getDocs(first);
        console.log("Insde " + plang.toString());
        // Get last visible document
        setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

        // Get data for first 10 documents
        setChallenges(
          documentSnapshots.docs.map((doc) => [doc.data(), doc.id])
        );
      };
      fetchData();
    } catch {
      setError("Something went wrong");
    }
  }, [plang]);

  if (error) {
    props.toast.error(error);
  }
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
    <ChallengeLangDiv isDarkMode={isDarkMode}>
      <TopDiv isDarkMode={isDarkMode}>
        <LangName>{lang}</LangName>
        <Box sx={{ width: "16%", padding: "15px" }}>
          <LinearProgress
            variant="determinate"
            value={80}
            sx={{
              color: "red",
              marginTop: "5px",
              backgroundColor: "white",
              "& .MuiLinearProgress-bar": {
                backgroundColor: "#663de5",
              },
            }}
          />
          <Progress>Progress: 12/123 | Points: 12</Progress>
        </Box>
      </TopDiv>
      <ChallengesList>
        {challenges.map((challenge, index) => {
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
        })}
      </ChallengesList>
      {challenges.length > 0 && challenges.length % 5 === 0 && (
        <LoadMoreBtn onClick={loadMore} isDarkMode={isDarkMode}>
          Load More
        </LoadMoreBtn>
      )}
    </ChallengeLangDiv>
  );
}

export default ChallengeLang;

const ChallengeLangDiv = styled.div`
  /* background-color: ; */
  color: ${(props) =>
    props.isDarkMode ? props.theme.dark.text : props.theme.light.text};
  width: 100%;
  height: 100%;
`;

const TopDiv = styled.div`
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.secondry
      : (props) => props.theme.light.secondry};
  padding: 15px;
  display: flex;
  align-items: center;
  border-bottom: solid #888 1px;
`;

const LangName = styled.div`
  font-size: 2.5rem;
`;

const Progress = styled.div`
  padding-top: 5px;
  opacity: 0.5;
  font-size: 0.9rem;
`;

const ChallengeSection = styled.div`
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.secondry
      : (props) => props.theme.light.secondry};
  color: ${(props) =>
    props.isDarkMode ? props.theme.dark.text : props.theme.light.text};
  padding: 8px;
  margin: 10px 0;
  border-radius: 4px;
  box-shadow: 2px 2px 4px 0 rgba(0, 0, 0, 0.3);
  /* &:hover {
    border: 1px solid ${(props) => props.theme.mainColor};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
  } */
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

const ChallengeInfo = styled.div`
  opacity: 0.7;
`;

const ChallengesList = styled.div`
  padding: 20px;
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
