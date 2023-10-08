import React, { useState, useEffect, useContext } from "react";
import { styled } from "styled-components";
// import { Link } from "react-router-dom";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";
// import { styled } from "@mui/material/styles";
import { ThemeContext } from "../App";
import ReviewCard from "../components/ReviewCard";
import { useNavigate } from "react-router-dom";

function CodeReview(props) {
  const [reviews, setReviews] = useState([]);
  const [lastDoc, setLastDoc] = useState();
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const fetchData = async () => {
        const first = query(
          collection(db, "codeReview"),
          orderBy("timestamp", "desc"),
          limit(5)
        );
        const documentSnapshots = await getDocs(first);

        // Get last visible document
        setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

        // Get data for first 10 documents
        setReviews(documentSnapshots.docs.map((doc) => [doc.data(), doc.id]));
      };
      fetchData();
    } catch {
      props.toast.error("Something went wrong");
    }
  }, []);
  console.log(reviews);
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
      setReviews((prevReviews) => [
        ...prevReviews,
        ...documentSnapshots.docs.map((doc) => [doc.data(), doc.id]),
      ]);
    } catch {
      props.toast("No more code reviews available");
    }
  };

  function CodeReviewComp({ review, reviewId }) {
    return (
      <ReviewDiv>
        <ReviewCard review={review} reviewId={reviewId}></ReviewCard>
      </ReviewDiv>
    );
  }

  return (
    <CodeReviewDiv isDarkMode={isDarkMode}>
      <UpperPart>
        <UpperPartText isDarkMode={isDarkMode}>
          Share and Review Code
        </UpperPartText>
        <UploadCodeReviewBtn
          isDarkMode={isDarkMode}
          onClick={() => navigate("/user/uploadcode")}
        >
          Upload Code
        </UploadCodeReviewBtn>
      </UpperPart>
      <CodeReviewComponent>
        {reviews.map((review) => (
          <CodeReviewComp
            key={review.id}
            review={review[0]}
            reviewId={review[1]}
          />
        ))}
      </CodeReviewComponent>
      {/* <LoadMoreBtn onClick={loadMore} isDarkMode={isDarkMode}>
        Load More
      </LoadMoreBtn> */}
      {reviews.length > 0 && reviews.length % 5 === 0 && (
        <LoadMoreBtn onClick={loadMore} isDarkMode={isDarkMode}>
          Load More
        </LoadMoreBtn>
      )}
    </CodeReviewDiv>
  );
}

export default CodeReview;

// CodeReview component

// const UploadCode = styled.div``;

const CodeReviewComponent = styled.div`
  width: 90%;
`;

const ReviewDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
`;

const CodeReviewDiv = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 93vh;

  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
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
const UpperPart = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const UpperPartText = styled.p`
  width: 80%;
  padding: 0 20px;
  opacity: 0.5;
  border-right: 1px solid
    ${(props) =>
      props.isDarkMode
        ? (props) => props.theme.dark.text
        : (props) => props.theme.light.text};
`;

const UploadCodeReviewBtn = styled.button`
  margin: 20px;
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.mainColor};
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  border: 2px solid;
  ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  &:hover {
    cursor: pointer;
    border: 2px solid ${(props) => props.theme.mainColorHover};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
  }
`;
