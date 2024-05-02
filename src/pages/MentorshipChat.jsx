import React, { useState, useContext, useEffect } from "react";
import styled from "styled-components";
import { db } from "../DB/FirebaseConfig";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  setDoc,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  deleteDoc,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";
// import UserProfile from "../images/UserProfile.png";
import SendIcon from "@mui/icons-material/Send";
import { useParams } from "react-router-dom";
import { ThemeContext } from "../App";
import { useNavigate } from "react-router-dom";

function MentorshipChat() {
  const param = useParams();
  const { isDarkMode } = useContext(ThemeContext);
  const { currentUser } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [mentorshipData, setMentorshipData] = useState({});
  const [mentorData, setMentorData] = useState({});
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (mentorshipData.mentorId && mentorshipData.userId) {
        // Fetch mentor data
        const mentorDoc = await getDoc(
          doc(db, "users", mentorshipData.mentorId)
        );
        const mentorData = mentorDoc.data();
        setMentorData(mentorData);

        // Fetch user data
        const userDoc = await getDoc(doc(db, "users", mentorshipData.userId));
        const userData = userDoc.data();
        setUserData(userData);
      }
    };
    fetchData();
  }, [mentorshipData]);

  useEffect(() => {
    const fetchData = async () => {
      const chatRef = doc(db, "mentorship", param.mentorshipId);
      const mentData = await getDoc(chatRef);
      // console.log("Test", mentData.data());
      setMentorshipData(mentData.data());
      // Listen for changes to the chat document
      const unsubscribe = await onSnapshot(chatRef, (doc) => {
        if (doc.exists()) {
          const chatData = doc.data();
          const messages = chatData.messages || []; // Use messages or empty array if not present
          setMessages(messages);
        } else {
          // Document doesn't exist, set messages to empty array
          setMessages([]);
        }
      });

      // Cleanup the listener when component unmounts or when chatId changes
      return () => {
        unsubscribe();
      };
    };
    fetchData();
  }, [param.mentorshipId]);

  const sendMessage = async () => {
    if (message.trim() === "") return;

    const chatRef = doc(db, "mentorship", param.mentorshipId);
    const chatDoc = await getDoc(chatRef);

    if (chatDoc.exists()) {
      await updateDoc(chatRef, {
        messages: arrayUnion({
          message: message,
          sender: currentUser.uid,
          time: new Date().toISOString(),
          read: false, // Assuming the message is not read when sent
        }),
      });
    } else {
      await setDoc(chatRef, {
        messages: [
          {
            message: message,
            sender: currentUser.uid,
            time: new Date().toISOString(),
            read: false,
          },
        ],
      });
    }
    setMessage("");
  };

  function formatMessageTime(timeString) {
    const messageTime = new Date(timeString);
    const now = new Date();
    const diffInHours = Math.abs(now - messageTime) / 36e5;

    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString();
    } else {
      return messageTime.toLocaleDateString();
    }
  }
  if (!mentorshipData) return <div>Loading...</div>;

  const endSession = async () => {
    // Remove the mentorshipId from the mentor's document
    await updateDoc(doc(db, "users", mentorshipData.mentorId), {
      mentorships: arrayRemove(param.mentorshipId),
    });

    // Remove the mentorshipId from the user's document
    await updateDoc(doc(db, "users", mentorshipData.userId), {
      mentorships: arrayRemove(param.mentorshipId),
    });

    // Delete the mentorship document
    await deleteDoc(doc(db, "mentorship", param.mentorshipId));
    navigate("/user/mentorship");
    // You can add additional logic here, such as notifying the mentor and mentee
  };

  return (
    <ChattingDiv isDarkMode={isDarkMode}>
      <RegisterTitle isDarkMode={isDarkMode}>
        <div>Mentor {mentorshipData.mentorName}</div>
        <Button onClick={endSession}>End Session</Button>
      </RegisterTitle>
      <MainDiv>
        <RightDiv>
          <ChatDiv>
            {messages &&
              messages.map((message, index) => (
                <MessageDiv
                  key={index}
                  alignRight={message.sender === currentUser.uid}
                  read={message.read}
                >
                  <div className="user-pic">
                    <img
                      src={
                        message.sender === currentUser.uid
                          ? currentUser.uid === mentorData.uid
                            ? mentorData.photoURL
                            : userData.photoURL
                          : currentUser.uid !== mentorData.uid
                          ? mentorData.photoURL
                          : userData.photoURL
                      }
                      alt=""
                      srcset=""
                    />
                  </div>
                  <div className="message-content">
                    <div className="user-name">
                      {message.sender === currentUser.uid
                        ? currentUser.uid === mentorData.uid
                          ? mentorData.displayName
                          : userData.displayName
                        : currentUser.uid !== mentorData.uid
                        ? mentorData.displayName
                        : userData.displayName}
                    </div>
                    <div className="message-text">{message.message}</div>
                    <div className="message-time">
                      {formatMessageTime(message.time)}
                    </div>
                  </div>
                </MessageDiv>
              ))}
          </ChatDiv>

          <SendChatDiv>
            <SendMessageInput
              isDarkMode={isDarkMode}
              type="text"
              placeholder="Type message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
            />
            <SendIcon
              style={{ fontSize: 30, cursor: "pointer" }}
              onClick={sendMessage}
            />
          </SendChatDiv>
        </RightDiv>
      </MainDiv>
    </ChattingDiv>
  );
}

export default MentorshipChat;

const ChattingDiv = styled.div`
  width: 100%;
  height: 100%;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const RegisterTitle = styled.div`
  font-size: 2.5rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.secondry
      : (props) => props.theme.light.secondry};
  padding: 10px;
  /* color: white; */
`;

const MainDiv = styled.div`
  display: flex;
  width: 100%;
  height: 84vh;
`;

const RightDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const ChatDiv = styled.div`
  height: 95%;
  overflow-y: scroll; /* Enable vertical scrolling */
`;

const SendChatDiv = styled.div`
  height: 5%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SendMessageInput = styled.input`
  width: 99%;
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
  border-radius: 50px;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  /* &:focus {
    outline: none;
    border: none;
  } */
`;

const MessageDiv = styled.div`
  margin-bottom: 10px;
  display: flex;
  flex-direction: ${(props) => (props.alignRight ? "row-reverse" : "row")};
  align-items: flex-start;

  > .user-pic {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden; /* Ensure the image stays within the circle */
    margin-right: 10px;
  }

  > .user-pic > img {
    width: 100%;
    height: 100%;
    object-fit: cover; /* Ensure the image covers the entire circle */
  }

  > .message-content {
    display: flex;
    flex-direction: column;
    max-width: 70%;
    word-wrap: break-word;
  }

  > .message-content > .user-name {
    font-weight: bold;
    margin-bottom: 3px;
    font-size: 1.1rem;
  }

  > .message-content > .message-text {
    padding: 5px 10px;
    border-radius: 8px;
    font-size: 1.3rem;
    color: black;
    background-color: ${(props) => (props.alignRight ? "#DCF8C6" : "#E8E8E8")};
  }

  > .message-content > .message-time {
    font-size: 0.8rem;
    /* color: limegreen; */
  }
`;

const Button = styled.button`
  background-color: #ff2424;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  margin-top: 10px;
`;
