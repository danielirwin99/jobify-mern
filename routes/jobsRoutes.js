import express from "express";
const router = express.Router();
import testUser from "../middleware/testUser.js";

import {
  createJob,
  deleteJob,
  getAllJobs,
  updateJob,
  showStats,
} from "../controllers/jobController.js";

router.route("/").post(testUser, createJob).get(getAllJobs);
router.route("/stats").get(showStats);
router.route("/:id").patch(testUser, updateJob).delete(testUser, deleteJob);

export default router;
