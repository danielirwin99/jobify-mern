import { useAppContext } from "../context/appContext";
import { useEffect } from "react";
import Loading from "./Loading";
import Job from "./Job";
import Alert from "./Alert";
import Wrapper from "../assets/wrappers/JobsContainer";
import PageBtnContainer from "./PageBtnContainer";

const JobsContainer = () => {
  const {
    getJobs,
    jobs,
    page,
    isLoading,
    totalJobs,
    search,
    searchStatus,
    searchType,
    sort,
    numOfPages,
    showAlert,
  } = useAppContext();

  // Once the Jobs Container renders
  useEffect(() => {
    // Creates a delay for processing the jobs so we can type without lag
    const delayForTyping = setTimeout(() => {
      getJobs();
    }, 500);

    return () => clearTimeout(delayForTyping);
    // All these values are carried through every time we refresh the page on All Jobs
  }, [search, searchStatus, searchType, sort, page]);

  if (isLoading) {
    return <Loading center />;
  }

  //   If there are no jobs
  if (jobs.length === 0) {
    return (
      <Wrapper>
        <h2>No jobs to display...</h2>
      </Wrapper>
    );
  }

  // If jobs.length > 0
  return (
    <Wrapper>
      {showAlert && <Alert />}
      <h5>
        {/* If there there is more than 1 job --> Add the "s" */}
        {totalJobs} job{jobs.length > 1 && "s"} found
      </h5>
      <div className="jobs">
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
      {/* Pagination Buttons */}
      {numOfPages > 1 && <PageBtnContainer />}
    </Wrapper>
  );
};

export default JobsContainer;
