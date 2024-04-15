import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import styled from "styled-components";
import { ThemeContext } from "../App";
import SearchJobImg from "../images/SearchJobImg.svg";
import SearchJobImg2 from "../images/SearchJobImg2.svg";
import SearchJobImg3 from "../images/SearchJobImg3.svg";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [searchJob, setSearchJob] = useState(null);
  const [expandedJobId, setExpandedJobId] = useState(null);
  // const language = "Python";
  const { isDarkMode } = useContext(ThemeContext);

  const handleKeyPress = async (e) => {
    if (e.key === "Enter") {
      // Call the search function when Enter is pressed
      const options = {
        method: "GET",
        url: "https://jsearch.p.rapidapi.com/search",
        params: {
          query: searchJob,
          page: "1",
          num_pages: "1",
        },
        headers: {
          "X-RapidAPI-Key":
            "5a141e889fmsh43409d054a3e801p190542jsn4b4c217a8add",
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      };

      try {
        const response = await axios.request(options);
        setJobs(response.data.data);
        console.log(response.data.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleReadMore = (jobId) => {
    setExpandedJobId(jobId === expandedJobId ? null : jobId);
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const options = {
  //       method: "GET",
  //       url: "https://jsearch.p.rapidapi.com/search",
  //       params: {
  //         query: ``,
  //         page: "4",
  //         num_pages: "1",
  //       },
  //       headers: {
  //         "X-RapidAPI-Key":
  //           "5a141e889fmsh43409d054a3e801p190542jsn4b4c217a8add",
  //         "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
  //       },
  //     };

  //     try {
  //       const response = await axios.request(options);
  //       setJobs(response.data.data);
  //       console.log(response.data.data.length);
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, [language]);

  return (
    <JobsDiv>
      <SearchInputAbove isDarkMode={isDarkMode}>
        <SearchInput
          isDarkMode={isDarkMode}
          onChange={(e) => {
            setSearchJob(e.target.value);
          }}
          onKeyPress={handleKeyPress}
        />
      </SearchInputAbove>
      <JobContainerDiv isDarkMode={isDarkMode}>
        {jobs.length > 0 ? (
          <>
            {jobs.map((job) => (
              <JobContainer>
                <>
                  {job.employer_logo && (
                    <EmployerLogo
                      src={job.employer_logo}
                      alt={job.employer_name}
                    />
                  )}
                  <JobTitle>{job.job_title}</JobTitle>
                </>

                <p>Employer: {job.employer_name}</p>
                <p>
                  Location: {job.job_city}, {job.job_country}
                </p>
                <p>Employment Type: {job.job_employment_type}</p>
                {job.job_description.length > 100 ? (
                  <>
                    <JobDescription>
                      {expandedJobId === job.id
                        ? job.job_description
                        : `${job.job_description}...`}
                    </JobDescription>
                    {/* {expandedJobId !== job.id && (
                      <ReadMoreLink onClick={() => handleReadMore(job.id)}>
                        Read more
                      </ReadMoreLink>
                    )} */}
                  </>
                ) : (
                  <JobDescription>{job.job_description}</JobDescription>
                )}
                <ApplyNowDiv>
                  <ApplyNowATag
                    href={job.job_apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    isDarkMode={isDarkMode}
                  >
                    Apply Now
                  </ApplyNowATag>
                </ApplyNowDiv>
              </JobContainer>
            ))}
          </>
        ) : (
          <ImgDiv>
            <JobImg src={SearchJobImg3} alt="" srcset="" />
            <SearchJobText>Search to find jobs !!!</SearchJobText>
          </ImgDiv>
        )}
      </JobContainerDiv>
    </JobsDiv>
  );
}

export default Jobs;

const JobsDiv = styled.div`
  width: 100%;
`;

const SearchInputAbove = styled.div`
  width: 100%;
  padding: 10px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const SearchInput = styled.input.attrs({
  type: "text",
  placeholder: "Search",
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

const JobContainer = styled.div`
  margin: 20px;
  padding: 20px;
  width: 450px;
  height: 450px;
  /* height: 300px; */
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const JobTitle = styled.h2`
  opacity: 0.8;
`;

const JobDescription = styled.div`
  opacity: 0.8;
  max-height: 8rem; /* Adjust the height as needed */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 5; /* Show 3 lines */
  -webkit-box-orient: vertical;
`;

const EmployerLogo = styled.img`
  max-width: 200px;
  max-height: 60px;
  margin-bottom: 10px;
`;

// const JobUpData = styled.div`
//   display: flex;
//   gap: 12px;
// `;

const JobContainerDiv = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  display: flex;
  overflow: auto;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
`;

const ReadMoreLink = styled.a`
  color: blue;
  cursor: pointer;
`;

const ApplyNowATag = styled.a`
  text-decoration: none;
  color: ${(props) =>
    props.isDarkMode
      ? (props) => props.theme.dark.text
      : (props) => props.theme.light.text};
  background-color: ${(props) => props.theme.mainColor};
  padding: 12px;
  border-radius: 5px;
`;

const ApplyNowDiv = styled.div`
  margin: 25px 25px 0 0;
  display: flex;
  justify-content: end;
`;

const ImgDiv = styled.div`
  width: 100vw;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const JobImg = styled.img`
  width: 25%;
`;

const SearchJobText = styled.h1``;
