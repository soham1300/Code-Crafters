import React, { useEffect, useContext, useState } from "react";
// import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../App";
import styled from "styled-components";
import UserProfileCard from "../components/UserProfileCard";
import UserProfileMobile from "../components/UserProfileMobile";
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
import IsMobile from "../components/IsMobile";

function Search({ toast }) {
  const { isDarkMode } = useContext(ThemeContext);
  const [lastUser, setLastUser] = useState();
  const [user, setUser] = useState([]);
  const isMobile = IsMobile();
  const [search, setSearch] = useState();
  const [searchUser, setSearchUser] = useState();

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      // Call the search function when Enter is pressed
      searchUsersByName(search)
        .then((matchingUsers) => {
          console.log("Matching users:", matchingUsers);
          setSearchUser(matchingUsers);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  useEffect(() => {
    try {
      const fetchData = async () => {
        const first = query(
          collection(db, "users"),
          orderBy("timestamp", "desc"),
          limit(2)
        );
        const documentSnapshots = await getDocs(first);

        // Get last visible document
        setLastUser(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

        // Get data for first 10 documents
        setUser(documentSnapshots.docs.map((doc) => [doc.data(), doc.id]));
      };
      fetchData();
    } catch {
      // toast("Something went wrong");
    }
  }, []);
  // Load more reviews
  const loadMore = async () => {
    try {
      const next = query(
        collection(db, "users"),
        orderBy("timestamp"),
        startAfter(lastUser),
        limit(2)
      );
      const documentSnapshots = await getDocs(next);

      // Get last document
      setLastUser(documentSnapshots.docs[documentSnapshots.docs.length - 1]);

      // Append to existing reviews
      setUser((prevReviews) => [
        ...prevReviews,
        ...documentSnapshots.docs.map((doc) => [doc.data(), doc.id]),
      ]);
    } catch {
      toast("Something went wrong");
    }
  };
  console.log(user);
  return (
    <SearchDiv>
      <SearchInput
        isDarkMode={isDarkMode}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        onKeyPress={handleKeyPress}
      />
      <VerticalLine />
      <UserTitle isDarkMode={isDarkMode}>
        {searchUser ? `Searched "${search}"` : "New Users"}
      </UserTitle>
      <Users>
        <NewUsers>
          {searchUser
            ? searchUser.map((userData) => {
                return isMobile ? (
                  <UserProfileMobile userData={userData} />
                ) : (
                  <UserProfileCard userData={userData} />
                );
              })
            : user.map((userData) => {
                return isMobile ? (
                  <UserProfileMobile userData={userData[0]} />
                ) : (
                  <UserProfileCard userData={userData[0]} />
                );
              })}

          {/* <UserProfileCard />
        <UserProfileMobile /> */}
        </NewUsers>
        {user.length > 0 ||
          (searchUser && searchUser.length > 0 && (
            <LoadMoreBtn onClick={loadMore} isDarkMode={isDarkMode}>
              Load More
            </LoadMoreBtn>
          ))}
      </Users>
    </SearchDiv>
  );
}

export default Search;

async function searchUsersByName(searchQuery) {
  const usersCollection = collection(db, "users");

  const usersQuery = query(
    usersCollection,
    where("displayName", "==", searchQuery)
  );

  try {
    const querySnapshot = await getDocs(usersQuery);

    const matchingUsers = [];

    querySnapshot.forEach((doc) => {
      // Access user data from the document
      const userData = doc.data();
      matchingUsers.push(userData);
    });

    return matchingUsers;
  } catch (error) {
    console.error("Error searching for users:", error);
    throw error;
  }
}

const SearchDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const SearchInput = styled.input.attrs({
  type: "text",
  placeholder: "Search",
})`
  width: 80vw;
  height: 5vh;
  padding-left: 1vw;
  margin-top: 1vw;
  font-size: 20px;
  /* border-bottom: #cccccc; */
  border: none;
  background-color: transparent;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  &:focus {
    outline: none;
    border: none;
  }
`;

const NewUsers = styled.div`
  margin-top: 7px;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2vh;
  overflow: auto;
  place-items: center;
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
  .UserProfileCard {
    min-width: 300px;
    flex-basis: calc(33.33% - 1rem);
    @media (max-width: 768px) {
      width: 100%;
      flex-basis: unset;
    }
  }
`;

const LoadMoreBtn = styled.button`
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

const Users = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  align-items: center;
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

const UserTitle = styled.h2`
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const VerticalLine = styled.div`
  width: 1px;
  height: 100%;
  background-color: #ccc; /* You can set the color you prefer */
  margin-left: 10px; /* Adjust the margin as needed */
`;
