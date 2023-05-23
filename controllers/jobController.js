import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index.js";
import Job from "../models/job.js";
import { StatusCodes } from "http-status-codes";
import checkPermissions from "../utils/checkPermissions.js";

// ------------------
// Creating a new job
// ------------------
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

// ----------------
// UPDATES JOB
// ----------------
const updateJob = async (req, res) => {
  // Giving our id the name of "jobId"
  const { id: jobId } = req.params;

  // We are grabbing the position and company in our updates
  const { position, company } = req.body;

  // If there is no company or position shown --> Throw the error
  // I.E IF one of them is missing
  if (!position || !company) {
    throw new BadRequestError("Please Provide All Values");
  }

  // Get the job that id matches the jobId
  const job = await Job.findOne({ _id: jobId });

  // If there is no job --> Throw the error
  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`);
  }

  // Check Permission
  // If we trigger the error --> We don't want to run the "updatedJob" function
  checkPermissions(req.user, job.createdBy);

  // Updates the new req.body
  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    // Returns the updated job instead of the old one
    new: true,
    runValidators: true,
  });

  // What we are returning in json form
  res.status(StatusCodes.OK).json({ updatedJob });
};

const deleteJob = async (req, res) => {
  // Grabs the id from the user and make it equal jobId
  const { id: jobId } = req.params;

  // Finds the job
  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job with id: ${jobId}`);
  }

  // Check Permission
  // If we trigger the error --> We don't want to run the function below
  checkPermissions(req.user, job.createdBy);

  await job.deleteOne()

  res.status(StatusCodes.OK).json({ msg: "Success! Job Removed" });
};

const showStats = (req, res) => {
  res.send("Show all stats");
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
