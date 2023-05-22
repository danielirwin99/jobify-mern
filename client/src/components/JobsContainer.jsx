import { useAppContext } from "../context/appContext";
import { useEffect } from "react";
import Loading from "./Loading";
import Job from "./Job";
import Wrapper from "../assets/wrappers/JobsContainer";

const JobsContainer = () => {
  const { getJobs, jobs, page, isLoading, totalJobs } = useAppContext();

  // Once the Jobs Container renders
  useEffect(() => {
    getJobs();
  }, []);

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
    </Wrapper>
  );
};

export default JobsContainer;
