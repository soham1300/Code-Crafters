import React, { useState, useContext, useEffect } from "react";
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
// import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
// import KeyboardArrowUpOutlinedIcon from "@mui/icons-material/KeyboardArrowUpOutlined";
import styled from "styled-components";
import { AuthContext } from "../context/AuthContext";
import { doc, updateDoc, arrayUnion, onSnapshot } from "firebase/firestore";
import { db } from "../DB/FirebaseConfig";

function ReviewCard({ review, reviewId }) {
  const isMobile = IsMobile();
  const [expanded, setExpanded] = useState(false);
  const timestamp = review.timestamp.toDate();
  const [reviews, setReviews] = useState(review);
  const [userReview, setUserReview] = useState("");
  const { currentUser } = useContext(AuthContext);
  const { isDarkMode } = useContext(ThemeContext);

  console.log("ReviewCard", review);

  useEffect(() => {
    onSnapshot(doc(db, "codeReview", reviewId), (doc) => {
      setReviews(doc.data());
    });
  }, [reviewId]);

  const SubmitReview = async () => {
    try {
      if (userReview) {
        await updateDoc(doc(db, "codeReview", reviewId), {
          reviews: arrayUnion({
            userReview: userReview,
            uid: currentUser.uid,
            userName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            votes: 0,
          }),
        });
        setUserReview("");
      }
    } catch {
      //   props.toast.error("Error submitting code review");
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
    <Card
      sx={{
        width: isMobile ? "100%" : "80%",
        border: isDarkMode ? "1px solid #e0e0e0" : "1px solid #000000",
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
          <Typography variant="body2" color={isDarkMode ? "white" : "black"}>
            {isToday
              ? timeago.format(timestamp).toString() // eslint-disable-next-line
              : timestamp.toDateString()}
          </Typography>
        }
      />
      <CardContent
        style={{
          backgroundColor: isDarkMode ? "#16161a" : "#c5c6c7",
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
          backgroundColor: isDarkMode ? "#16161a" : "#c5c6c7",
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
          backgroundColor: isDarkMode ? "#16161a" : "#c5c6c7",
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
          {reviews.reviews.length > 1 &&
            reviews.reviews.map((review, index) => {
              return (
                <div key={index}>
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
                </div>
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
  );
}

export default ReviewCard;

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
