import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { ThemeContext } from "../App";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContex";
import { AuthContext } from "../context/AuthContext";
import { db } from "../DB/FirebaseConfig";
// import { doc, getDoc } from "firebase/firestore";
import ReviewCard from "../components/ReviewCard";
import {
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  startAfter,
} from "firebase/firestore";

function UserCodeReview({ toast }) {
  const navigate = useNavigate();
  const { isDarkMode } = useContext(ThemeContext);
  const { userData } = useContext(UserContext);
  const { currentUser } = useContext(AuthContext);
  const [uploadedCode, setUploadedCode] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastDoc, setLastDoc] = useState();
  const [error, setError] = useState(null);

  // useEffect(() => {
  //   const fetchUploadedCode = async () => {
  //     if (userData.codeReview) {
  //       const codeReviewData = await Promise.all(
  //         userData.codeReview.map(async (codeReviewId) => {
  //           const reviewData = await getDoc(
  //             doc(db, "codeReview", codeReviewId)
  //           );
  //           return [reviewData.data(), codeReviewId];
  //         })
  //       );
  //       setUploadedCode(codeReviewData);
  //       setLoading(false);
  //     }
  //   };

  //   fetchUploadedCode();
  // }, [userData.codeReview]);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const first = query(
          collection(db, "codeReview"),
          orderBy("timestamp"),
          limit(5)
        );
        const documentSnapshots = await getDocs(first);

        // Get last visible document
        setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

        // Get data for first 10 documents
        setUploadedCode(
          documentSnapshots.docs.map((doc) => [doc.data(), doc.id])
        );
        setLoading(false);
      };
      fetchData();
    } catch {
      setError("Something went wrong");
    }
  }, []);
  // Load more reviews
  const loadMore = async () => {
    try {
      const next = query(
        collection(db, "codeReview"),
        orderBy("timestamp"),
        startAfter(lastDoc),
        limit(5)
      );
      const documentSnapshots = await getDocs(next);

      // Get last document
      setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

      // Append to existing reviews
      setUploadedCode((prevReviews) => [
        ...prevReviews,
        ...documentSnapshots.docs.map((doc) => [doc.data(), doc.id]),
      ]);
    } catch {
      toast.error("No more code reviews available");
    }
  };

  if (error) {
    toast.error(error);
  }

  function CodeReviewComp({ review, reviewId }) {
    return (
      <ReviewDiv>
        <ReviewCard review={review} reviewId={reviewId}></ReviewCard>
      </ReviewDiv>
    );
  }

  return (
    <UserCodeReviewDiv>
      <UploadCodeReviewBtn
        isDarkMode={isDarkMode}
        onClick={() => navigate("/user/uploadcode")}
        isCurrentUser={userData.uid === currentUser.uid}
      >
        Upload Code
      </UploadCodeReviewBtn>
      <CodeReviewUploaded isDarkMode={isDarkMode}>
        <Title>User Code Reviews</Title>
        <CodeUploded>
          {loading ? (
            <h3>Code Not Uploaded Yet</h3>
          ) : (
            uploadedCode && (
              <>
                <CodeReviewComponent>
                  {uploadedCode.map((review) => (
                    <CodeReviewComp
                      key={review.id}
                      review={review[0]}
                      reviewId={review[1]}
                    />
                  ))}
                </CodeReviewComponent>
                {uploadedCode.length > 0 && uploadedCode.length % 5 === 0 && (
                  <LoadMoreBtn onClick={loadMore} isDarkMode={isDarkMode}>
                    Load More
                  </LoadMoreBtn>
                )}
              </>
            )
          )}
        </CodeUploded>
      </CodeReviewUploaded>
    </UserCodeReviewDiv>
  );
}

export default UserCodeReview;

const UserCodeReviewDiv = styled.div`
  width: 100%;
  /* background-color: #f5f5f5; */
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
  display: ${(props) => (props.isCurrentUser ? "block" : "none")};
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

const CodeReviewUploaded = styled.div`
  margin: 0 20px;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const Title = styled.h2``;

const CodeUploded = styled.div`
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ReviewDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
`;

const CodeReviewComponent = styled.div`
  width: 90%;
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
