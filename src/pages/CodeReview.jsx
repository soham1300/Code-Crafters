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
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";

import Typography from "@mui/material/Typography";

import * as timeago from "timeago.js";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { ThemeContext } from "../App";
import { githubLight, githubDark } from "@uiw/codemirror-theme-github";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import IsMobile from "../components/IsMobile";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import {
  // addDoc,
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
  // serverTimestamp,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

function CodeReview(props) {
  const [reviews, setReviews] = useState([]);
  const [lastDoc, setLastDoc] = useState();
  const { isDarkMode } = useContext(ThemeContext);

  useEffect(() => {
    const fetchData = async () => {
      const first = query(
        collection(db, "codeReview"),
        orderBy("timestamp"),
        limit(2)
      );
      const documentSnapshots = await getDocs(first);

      // Get last visible document
      setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

      // Get data for first 10 documents
      setReviews(documentSnapshots.docs.map((doc) => [doc.data(), doc.id]));
    };
    fetchData();
  }, []);
  console.log(reviews);
  // Load more reviews
  const loadMore = async () => {
    try {
      const next = query(
        collection(db, "codeReview"),
        orderBy("timestamp"),
        startAfter(lastDoc),
        limit(2)
      );
      const documentSnapshots = await getDocs(next);

      // Get last document
      setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

      // Append to existing reviews
      setReviews((prevReviews) => [
        ...prevReviews,
        ...documentSnapshots.docs.map((doc) => [doc.data(), doc.id]),
      ]);
    } catch {}
  };

  function CodeReviewComp({ review, reviewId }) {
    const [expanded, setExpanded] = useState(false);
    const timestamp = review.timestamp.toDate();
    const [reviews, setReviews] = useState(review);
    const isMobile = IsMobile();
    const [userReview, setUserReview] = useState();
    const { currentUser } = useContext(AuthContext);
    useEffect(() => {
      onSnapshot(doc(db, "codeReview", reviewId), (doc) => {
        setReviews(doc.data());
      });
    }, [reviewId]);
    const SubmitReview = async () => {
      try {
        await updateDoc(doc(db, "codeReview", reviewId), {
          reviews: arrayUnion({
            userReview: userReview,
            uid: currentUser.uid,
            userName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          }),
        });
        setUserReview("");
      } catch {
        props.toast.error("Error submitting code review");
      }
    };

    // Check if today
    const isToday =
      timestamp.getDate() === new Date().getDate() &&
      timestamp.getMonth() === new Date().getMonth();

    const handleExpandClick = () => {
      setExpanded(!expanded);
    };

    const handleOnEnter = (e) => {
      e.code === "Enter" && SubmitReview();
    };

    return (
      <ReviewDiv>
        <Card
          sx={{
            width: isMobile ? "100%" : "80%",
          }}
        >
          <CardHeader
            style={{
              backgroundColor: isDarkMode ? "#1e2025" : "white",
              color: isDarkMode ? "white" : "black",
            }}
            avatar={<Avatar alt={review.displayName} src={review.photoURL} />}
            title={<b style={{ fontSize: "larger" }}>{review.displayName}</b>}
            subheader={
              <Typography
                variant="body2"
                color={isDarkMode ? "white" : "black"}
              >
                {isToday
                  ? timeago.format(timestamp).toString()
                  : timestamp.toDateString()}
              </Typography>
            }
          />
          <CardContent
            style={{
              backgroundColor: isDarkMode ? "#1b2225" : "#c5c6c7",
              color: isDarkMode ? "white" : "black",
            }}
          >
            <Typography variant="body2" color={isDarkMode ? "white" : "black"}>
              {review.instruction}
            </Typography>
          </CardContent>
          <CardMedia
            component="code"
            style={{
              backgroundColor: isDarkMode ? "#1b2225" : "#c5c6c7",
              color: isDarkMode ? "white" : "black",
            }}
          >
            {review.type === "code" ? (
              <CodeMirror
                theme={isDarkMode ? githubDark : githubLight}
                value={review.code}
                maxHeight="50vh"
                extensions={[javascript({ jsx: true })]}
              />
            ) : (
              <CodeReviewLink href={review.code}>{review.code}</CodeReviewLink>
            )}
          </CardMedia>

          <CardActions
            disableSpacing
            style={{
              backgroundColor: isDarkMode ? "#1b2225" : "#c5c6c7",
              color: isDarkMode ? "white" : "black",
            }}
          >
            <RateReviewOutlinedIcon
              expand={expanded}
              onClick={handleExpandClick}
              aria-expanded={expanded}
              aria-label="show more"
              fontSize="medium"
            />
          </CardActions>
          <Collapse
            in={expanded}
            timeout="auto"
            unmountOnExit
            style={{
              backgroundColor: isDarkMode ? "#1b2225" : "#c5c6c7",
              color: isDarkMode ? "white" : "black",
            }}
          >
            <CardContent
              sx={{
                maxHeight: "50vh",
                overflow: "auto ",
                "::-webkit-scrollbar": {
                  width: "10px",
                },
                "::-webkit-scrollbar-thumb": {
                  background: "#888",
                  borderRadius: "5px",
                },
                "::-webkit-scrollbar-track:hover": {
                  background: "#555",
                },
                "::-webkit-scrollbar-thumb:active": {
                  background: "#333",
                },
              }}
            >
              {reviews.reviews.map((review) => {
                return (
                  <>
                    <ReviewUserData>
                      <Avatar
                        alt={review.userName}
                        src={review.photoURL}
                        sx={{ width: 24, height: 24 }}
                      />
                      <Typography>
                        <strong>{review.userName}</strong>
                      </Typography>
                    </ReviewUserData>
                    <ReviewData>{review.userReview}</ReviewData>
                  </>
                );
              })}
            </CardContent>
            <hr />
            <AddReview>
              <ReviewInput
                isDarkMode={isDarkMode}
                value={userReview}
                onChange={(e) => {
                  setUserReview(e.target.value);
                }}
                onKeyDown={handleOnEnter}
              />
              <SendOutlinedIcon onClick={SubmitReview} />
            </AddReview>
          </Collapse>
        </Card>
      </ReviewDiv>
    );
  }

  return (
    <CodeReviewDiv isDarkMode={isDarkMode}>
      {/* <UploadCode>
        I don't have any idea what to do here. So plz click
        <Link to="/user/uploadcode">Here</Link>
        Upload your code to review
      </UploadCode> */}
      <CodeReviewComponent>
        {reviews.map((review) => (
          <CodeReviewComp
            key={review.id}
            review={review[0]}
            reviewId={review[1]}
          />
        ))}
      </CodeReviewComponent>
      <LoadMoreBtn onClick={loadMore} isDarkMode={isDarkMode}>
        Load More
      </LoadMoreBtn>
    </CodeReviewDiv>
  );
}

export default CodeReview;

// CodeReview component

// const UploadCode = styled.div``;

const CodeReviewComponent = styled.div``;

const ReviewDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
`;

const CodeReviewDiv = styled.div`
  display: flex;
  flex-direction: column;

  width: 83vw;
  height: 93vh;
  overflow: auto;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
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

const ReviewInput = styled.input.attrs({
  type: "url",
  placeholder: "Enter your review on code",
})`
  width: 93%;
  padding: 10px;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s;
  background-color: transparent;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};

  &::placeholder {
    color: #999;
  }
`;

const AddReview = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 5px;
  align-items: center;
`;

const ReviewUserData = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
`;

const ReviewData = styled.p`
  margin-left: 24px;
`;

const CodeReviewLink = styled.a`
  text-decoration: none;
  color: ${(props) => props.theme.mainColor};
  margin-left: 15px;
`;

const LoadMoreBtn = styled.button`
  margin: 0 40vw;
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
