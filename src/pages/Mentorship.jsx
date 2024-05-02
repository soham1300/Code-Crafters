import React, { useContext, useState, useEffect } from "react";
import styled from "styled-components";
import { ThemeContext } from "../App";
import MentorImg from "../images/Mentor.svg";
import { useNavigate } from "react-router-dom";
import { db } from "../DB/FirebaseConfig";
import {
  collection,
  query,
  getDocs,
  where,
  getDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
} from "firebase/firestore";
import { AuthContext } from "../context/AuthContext";

function Mentorship({ toast }) {
  const { isDarkMode } = useContext(ThemeContext);
  const navigate = useNavigate();
  const [searchMentor, setSearchMentor] = useState("");
  const [mentors, setMentors] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const [userData, setUserData] = useState({});
  const [error, setError] = useState(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [mentorshipRequests, setMentorshipRequests] = useState([]);
  const [mentorshipData, setMentorshipData] = useState([]);
  const [mentorshipId, setMentorshipId] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const mentor = await getDoc(doc(db, "users", currentUser.uid));
        const mentorData = mentor.data();
        const requests = mentorData.mentorshipRequests || [];
        const requestsData = [];
        // here is the mentorData.mentorships data is there
        const mentorshipData = [];
        console.log("Mentor", mentorData.mentorships);
        setMentorshipId(mentorData.mentorships);
        for (const mentorshipId of mentorData.mentorships) {
          console.log("Mentor1", mentorshipId);
          const mentorshipDoc = await getDoc(
            doc(db, "mentorship", mentorshipId)
          );
          const mentorship = mentorshipDoc.data();
          mentorshipData.push(mentorship);
        }
        console.log(mentorshipData);
        setMentorshipData(mentorshipData);
        for (const requestId of requests) {
          const requestUser = await getDoc(doc(db, "users", requestId));
          const requestUserData = requestUser.data();
          requestsData.push({
            uid: requestId,
            displayName: requestUserData.displayName,
            details: requestUserData.mentorBio,
          });
        }

        setMentorshipRequests(requestsData);
      } catch (error) {
        console.error("Error fetching mentorship requests:", error);
      }
    };

    fetchRequests();
  }, [currentUser.uid]);
  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      try {
        // const mentorsRef = db.collection("users");
        // const query = mentorsRef.where(
        //   "expertise",
        //   "array-contains",
        //   searchMentor
        // );
        // const snapshot = await query.get();
        // const mentors = snapshot.docs.map((doc) => doc.data());

        const q = query(
          collection(db, "users"),
          where("expertise", "array-contains", searchMentor)
        );

        const querySnapshot = await getDocs(q);
        const mentors = querySnapshot.docs.map((doc) => doc.data());
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          console.log("UserType", currentUser);
        });

        setMentors(mentors);
      } catch (error) {
        toast.error(error.message);
        console.log(error);
      }
    }
  };
  if (mentors.length > 0) {
    console.log("mentors", mentors);
  }

  if (error) {
    toast.error(error.message);
  }

  const handleRequestSend = async (mentor) => {
    try {
      const mentorshipRequests = mentor.mentorshipRequests ?? [];
      // Default to empty array if undefined
      if (mentorshipRequests.includes(currentUser.uid)) {
        throw new Error("Mentorship request already sent");
      }
      const mentorRef = doc(db, "users", mentor.uid);
      await updateDoc(mentorRef, {
        mentorshipRequests: arrayUnion(currentUser.uid),
      });
      toast.success("Request send successfully");
    } catch (error) {
      if (error.message === "Mentorship request already sent") {
        toast.error("Mentorship request already sent");
      } else {
        toast.error("Failed to send mentorship request");
      }
      setIsButtonDisabled(false); // Re-enable the button on error
    }
  };
  if (mentorshipData) console.log("Data", mentorshipData);
  const MentorshipRequest = ({ request, onAccept, onReject }) => {
    return (
      <RequestCard isDarkMode={isDarkMode}>
        <RequestInfo>
          <RequestName>{request.displayName}</RequestName>
          <RequestDetails>{request.details}</RequestDetails>
        </RequestInfo>
        <BtnDiv>
          <AcceptBtn onClick={() => onAccept(request)}>Accept</AcceptBtn>
          <RejectBtn onClick={() => onReject(request)}>Reject</RejectBtn>
        </BtnDiv>
      </RequestCard>
    );
  };

  // const handleRequestAccept = async (request) => {
  //   try {
  //     // Remove the user ID from mentor's mentorshipRequests
  //     const mentorRef = doc(db, "users", currentUser.uid);
  //     await updateDoc(mentorRef, {
  //       mentorshipRequests: arrayRemove(request.uid),
  //     });

  //     // Create a new mentorship document
  //     const mentorshipId = currentUser.uid + request.uid; // Example ID, you can use any unique ID generation logic
  //     const mentorshipRef = doc(db, "mentorship", mentorshipId);
  //     await setDoc(mentorshipRef, {
  //       mentorId: currentUser.uid,
  //       userId: request.uid,
  //       status: "accepted",
  //       mentorName: currentUser.displayName,
  //       userName: request.displayName,
  //     });

  //     // Update the mentor and user documents with the mentorship ID
  //     await updateDoc(mentorRef, {
  //       mentorships: arrayUnion(mentorshipId),
  //     });
  //     const userRef = doc(db, "users", request.uid);
  //     await updateDoc(userRef, {
  //       mentorships: arrayUnion(mentorshipId),
  //     });

  //     toast.success("Request Accepted Successfully");
  //   } catch (error) {
  //     toast.error("Failed to accept request");
  //     console.error(error);
  //   }
  // };

  // const handleRejectRequest = async (request) => {
  //   try {
  //     const mentorRef = doc(db, "users", currentUser.uid);
  //     await updateDoc(mentorRef, {
  //       mentorshipRequests: arrayRemove(request),
  //     });
  //     toast.error("Request Rejected Successfully");
  //   } catch (error) {
  //     console.error("Error rejecting request:", error);
  //   }
  // };

  const handleRequestAccept = async (request) => {
    try {
      // Remove the request from mentor's mentorshipRequests
      const mentorRef = doc(db, "users", currentUser.uid);
      await updateDoc(mentorRef, {
        mentorshipRequests: arrayRemove(request.uid),
      });

      // Create a new mentorship document
      const mentorshipId = currentUser.uid + request.uid; // Example ID, you can use any unique ID generation logic
      const mentorshipRef = doc(db, "mentorship", mentorshipId);
      await setDoc(mentorshipRef, {
        mentorId: currentUser.uid,
        userId: request.uid,
        status: "accepted",
        mentorName: currentUser.displayName,
        userName: request.displayName,
      });

      // Update the mentor and user documents with the mentorship ID
      await updateDoc(mentorRef, {
        mentorships: arrayUnion(mentorshipId),
      });
      const userRef = doc(db, "users", request.uid);
      await updateDoc(userRef, {
        mentorships: arrayUnion(mentorshipId),
      });

      // Update the mentorship requests state
      setMentorshipRequests((prevRequests) =>
        prevRequests.filter((req) => req.uid !== request.uid)
      );

      toast.success("Request Accepted Successfully");
    } catch (error) {
      toast.error("Failed to accept request");
      console.error(error);
    }
  };

  const handleRejectRequest = async (request) => {
    try {
      const mentorRef = doc(db, "users", currentUser.uid);
      await updateDoc(mentorRef, {
        mentorshipRequests: arrayRemove(request.uid),
      });

      // Update the mentorship requests state
      setMentorshipRequests((prevRequests) =>
        prevRequests.filter((req) => req.uid !== request.uid)
      );

      toast.error("Request Rejected Successfully");
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <MentorshipDiv isDarkMode={isDarkMode}>
      <TitleDiv isDarkMode={isDarkMode}>
        <>Mentorship</>
        {userData.userType === "working" && (
          <UploadCodeReviewBtn
            isDarkMode={isDarkMode}
            onClick={() => navigate("/user/addmentor")}
          >
            Become a mentor
          </UploadCodeReviewBtn>
        )}
      </TitleDiv>
      <FindMentorDiv>
        <SearchInput
          isDarkMode={isDarkMode}
          onChange={(e) => {
            setSearchMentor(e.target.value);
          }}
          onKeyPress={handleKeyPress}
        />
        <MentorshipRequestsDiv>
          {mentorshipRequests.map((request, index) => (
            <>
              <MentorshipRequestsTitle>
                Pending Mentorship Requests
              </MentorshipRequestsTitle>
              <MentorshipRequest
                key={index}
                request={request}
                onAccept={handleRequestAccept}
                onReject={handleRejectRequest}
              />
            </>
          ))}
        </MentorshipRequestsDiv>
        {mentorshipData &&
          mentorshipData.map((mentorship, index) => (
            <ActiveMentorshipDiv
              key={index}
              onClick={() => navigate(`/user/mentor/${mentorshipId[index]}`)}
            >
              <ActiveMentorshipTitle>Active Mentorship</ActiveMentorshipTitle>
              <ActiveMentorshipDetails isDarkMode={isDarkMode}>
                <MentorshipMentorName>
                  {mentorship.mentorName}
                </MentorshipMentorName>
                <p>Status: {mentorship.status}</p>
                {/* Add more details as needed */}
              </ActiveMentorshipDetails>
            </ActiveMentorshipDiv>
          ))}

        <>
          {mentors.length > 0 ? (
            <MentorDiv>
              {mentors.map((mentor, index) => (
                <MentorCard key={index} isDarkMode={isDarkMode}>
                  <MentorImgDiv>
                    <MentorDisplayPic src={mentor.photoURL} alt="" srcset="" />
                  </MentorImgDiv>
                  <MentorInfoDiv>
                    <MentorName>
                      {mentor.displayName} ({mentor.mentorType})
                    </MentorName>
                    <MentorWork>
                      {mentor.currentJob} Developer at {mentor.currentWorkplace}
                    </MentorWork>
                    <MentorBio>{mentor.mentorBio}</MentorBio>
                    <MentorExpert>
                      {mentor.expertise.map((expert, index) => (
                        <MentorExpertDiv key={index} isDarkMode={isDarkMode}>
                          {expert}
                        </MentorExpertDiv>
                      ))}
                    </MentorExpert>
                    <BtnDiv>
                      <RequestMentorBtn
                        isDarkMode={isDarkMode}
                        onClick={async () => {
                          setIsButtonDisabled(true);
                          handleRequestSend(mentor);
                        }}
                        i
                        disabled={
                          isButtonDisabled ||
                          mentor.mentorshipRequests.includes(currentUser.uid)
                        }
                      >
                        Mentorship Request
                      </RequestMentorBtn>
                      <ViewProfileBtn
                        isDarkMode={isDarkMode}
                        onClick={() => navigate(`/user/profile/${mentor.uid}`)}
                      >
                        View Profile
                      </ViewProfileBtn>
                    </BtnDiv>
                  </MentorInfoDiv>
                </MentorCard>
              ))}
            </MentorDiv>
          ) : (
            <ImgDiv>
              <JobImg src={MentorImg} alt="" srcset="" />
              <SearchJobText>Search to find mentor !!!</SearchJobText>
            </ImgDiv>
          )}
        </>
      </FindMentorDiv>
    </MentorshipDiv>
  );
}

export default Mentorship;

const MentorshipDiv = styled.div`
  color: ${(props) => (props.isDarkMode ? "#FFFFFF" : "#1A2731")};
`;

const TitleDiv = styled.div`
  font-size: 24px;
  font-weight: bold;
  padding: 20px;
  color: ${(props) => (props.isDarkMode ? "#FFFFFF" : "#1A2731")};
  background-color: ${(props) => (props.isDarkMode ? "#1A2731" : "#FFFFFF")};
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const UploadCodeReviewBtn = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.mainColor};
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  /* border: 2px solid;
  ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text}; */
  border: 2px solid transparent;
  &:hover {
    cursor: pointer;
    border: 2px solid ${(props) => props.theme.mainColorHover};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
  }
`;

const SearchInput = styled.input.attrs({
  type: "text",
  placeholder: "Find a mentor",
})`
  width: 90%;
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

const FindMentorDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px 0;
  flex-direction: column;
`;

const ImgDiv = styled.div`
  width: 100%;
  height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const JobImg = styled.img`
  width: 20%;
`;

const SearchJobText = styled.h1``;

const MentorDiv = styled.div``;

const MentorCard = styled.div`
  width: 100%;
  padding: 20px;
  margin: 20px 0;
  background-color: ${(props) => (props.isDarkMode ? "#1A2731" : "#FFFFFF")};
  border-radius: 10px;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  display: flex;

  &:hover {
    box-shadow: 0 0 5px #5a5a5a;
    /* color: ${(props) => props.theme.dark.text}; */
    border-radius: 10px;
    transition: 0.3s;
    transform: scale(1.05);
    transition-timing-function: ease-in-out;
    transition-duration: 0.3s;
    transition-delay: 0s;
    transition-property: all;
    transition-timing-function: ease-in-out;
  }
`;

const MentorImgDiv = styled.div`
  width: 20%;
`;

const MentorDisplayPic = styled.img`
  width: 100%;
`;

const MentorInfoDiv = styled.div`
  width: 80%;
  padding: 0 20px;
`;

const MentorName = styled.p`
  font-size: 2rem;
  font-weight: bold;
  margin: 0;
`;

const MentorWork = styled.p`
  font-size: 1.5rem;
  margin: 0;
  padding: 0;
`;

const MentorBio = styled.div`
  font-size: 1rem;
  padding: 12px 0;
`;

const MentorExpertDiv = styled.div`
  padding: 10px;
  background-color: ${(props) => (props.isDarkMode ? "#121f28" : "#e4e4e7")};
  width: 100px;
`;

const MentorExpert = styled.div`
  display: flex;
  gap: 20px;
`;

const RequestMentorBtn = styled.div`
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.mainColor};
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  /* border: 2px solid;
${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text}; */
  border: 2px solid transparent;
  &:hover {
    cursor: pointer;
    border: 2px solid ${(props) => props.theme.mainColorHover};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
  }
`;

const ViewProfileBtn = styled.div`
  padding: 10px 20px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.mainColor};
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  /* border: 2px solid;
  ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text}; */
  border: 2px solid transparent;
  &:hover {
    cursor: pointer;
    border: 2px solid ${(props) => props.theme.mainColorHover};
    box-shadow: 0 0 5px ${(props) => props.theme.mainColor};
  }
`;

const BtnDiv = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 20px;
  gap: 20px;
`;

const RequestCard = styled.div`
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.secondry
      : (props) => props.theme.light.secondry};
  border-radius: 10px;
  padding: 10px;
  margin: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RequestInfo = styled.div`
  flex: 1;
`;

const RequestName = styled.p`
  font-weight: bold;
  margin: 0;
`;

const RequestDetails = styled.p`
  margin: 0;
`;

const AcceptBtn = styled.button`
  background-color: #5cb85c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const RejectBtn = styled.button`
  background-color: #d9534f;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
`;

const MentorshipRequestsDiv = styled.div`
  margin-top: 20px;
`;

const MentorshipRequestsTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ActiveMentorshipDiv = styled.div`
  margin-top: 20px;
`;

const ActiveMentorshipTitle = styled.h2`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
`;

const ActiveMentorshipDetails = styled.div`
  font-size: 16px;
  background-color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.secondry
      : (props) => props.theme.light.secondry};
  border-radius: 5px;
  padding: 10px 20px;
  cursor: pointer;
`;

const MentorshipMentorName = styled.p`
  font-size: 1.5rem;
  margin: 0;
`;
