import {
  BadRequestError,
  NotFoundError,
  UnAuthenticatedError,
} from "../errors/index.js";
import Job from "../models/Job.js";
import { StatusCodes } from "http-status-codes";
import checkPermissions from "../utils/checkPermissions.js";
import mongoose from "mongoose";
import moment from "moment";

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

// ------------------
// Getting the jobs
// ------------------
const getAllJobs = async (req, res) => {
  // We are pulling out these values to use for our query search that we are passing in the frontend
  const { search, status, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

   // Search will be added conditionally (not like the other 2 above)
   if (search) {
    // Mongoose regex lets us search everything without having to type in specifics
    queryObject.position = { $regex: search, $options: "i" }; // $options: "i" --> removes case sensitive
  }

  // Add stuff based on conditions

  // If status does NOT equal to all --> It has to be either pending, declined or interview
  if (status !== "all") {
    queryObject.status = status;
  }

  // Same as above but for jobType
  if (jobType !== "all") {
    queryObject.jobType = jobType;
  }

  // NO AWAIT
  let result = Job.find(queryObject);

  // -------------
  // Chain sort conditions
  // -------------
  if (sort === "latest") {
    // Descending Order
    result = result.sort("-createdAt");
  }

  if (sort === "oldest") {
    // Ascending Order
    result = result.sort("createdAt");
  }

  if (sort === "a-z") {
    // We already have it in order so its just default
    result = result.sort("position");
  }

  if (sort === "z-a") {
    result = result.sort("-position");
  }

  // Our Pagination Functionality
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);

  const jobs = await result;

  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
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

  await job.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "Success! Job Removed" });
};

// -------------------
// GETS ALL THE STATS
// -------------------

const showStats = async (req, res) => {
  // Using the aggregation-pipeline method --> Check MongoDB Docs
  let stats = await Job.aggregate([
    // Get me all the jobs that belong to the certain userId
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },

    // Whatever is remainder
    // We are accessing the status property value
    // Count is how many were under the property value x by the sum value
    // i.e there are 20 declined with a sum of 1 --> "count" : 20
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  // Using the .reduce method --- TURNS it into an object from an array
  stats = stats.reduce((acc, curr) => {
    // We want to pull out our title and count out of the iteration
    const { _id: title, count } = curr;
    // acc --> The object that you're returning
    // title --> Whatever is the value i.e pending, declined or interview
    acc[title] = count;
    return acc;
  }, {});

  // Categorises the stats to equal the value above OR 0 --> So our Frontend doesn't break
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  // Our Monthly Applications Structure
  let monthlyApplications = await Job.aggregate([
    // Grabbing all the jobs that belong to the specific userId
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        // We will group based on year and month
        _id: {
          year: {
            // Let year equal the createdAt year
            $year: "$createdAt",
          },
          month: {
            // Let month equal the createdAt month
            $month: "$createdAt",
          },
        },
        // group x the sum value = 1
        count: { $sum: 1 },
      },
    },
    // Sorting by the latest jobs first (-1) --> Descending order
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    // Only displays the last 6 months --> For our chart
    { $limit: 6 },
  ]);

  // Iterating over the data
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        // Pull out year and month from the id
        _id: { year, month },
        // Pull out the count from the data
        count,
      } = item;

      // Using our moment npm package
      // In moment package it counts the months 0-11, whereas on MongoDB its 1-12
      // ---> Thats why we need to -1
      const date = moment()
        .month(month - 1)
        .year(year - 1)
        .format("MMM Y");
      // Returning these two
      return { date, count };
    })
    // The charts are going to be showing oldest to newest so we need to flip it
    .reverse();

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

export { createJob, deleteJob, getAllJobs, updateJob, showStats };
