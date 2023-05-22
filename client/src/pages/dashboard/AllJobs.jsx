import React from "react";
import { JobsContainer, SearchContainer } from "../../components";
import Wrapper from "../../assets/wrappers/Job";

const AllJobs = () => {
  return (
    <Wrapper>
      <SearchContainer />
      <JobsContainer />
    </Wrapper>
  );
};

export default AllJobs;
