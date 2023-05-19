import { BadRequestError, NotFoundError } from "../errors/index.js";
import Job from "../models/job.js";
import { StatusCodes } from "http-status-codes";

// Creating a new job
const createJob = async (req, res) => {
  // Pulling through these two values from the User inputting them
  const { position, company } = req.body;

  // If there is no position or company filled out
  if (!position || !company) {
    throw new BadRequestError("Please provide values");
  }

  // Syncs the User to the
  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId });
  res
    .status(StatusCodes.OK)
    .json({ jobs, totalJobs: jobs.length, numOfPages: 1 });
};

const updateJob = (req, res) => {
  res.send("Update Job");
};
const deleteJob = (req, res) => {
  res.send("Delete Job");
};
const showStats = (req, res) => {
  res.send("Show all stats");
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
