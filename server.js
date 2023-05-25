import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import morgan from "morgan";

// Connects us to the mongoDB and authenticateUser
import connectDB from "./db/connect.js";

// Routers
import authRouter from "./routes/authRoutes.js";
import jobRouter from "./routes/jobsRoutes.js";

// Middleware
import notFoundMiddleware from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import authenticateUser from "./middleware/auth.js";

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Lets us pass through json data with this Express Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Home Route
// app.get("/", (req, res) => {
//   res.json({ msg: "Welcome!" });
// });

app.get("/api/v1", (req, res) => {
  res.json({ msg: "Api Route" });
});

// Our Auth Router
app.use("/api/v1/auth", authRouter);
// Our Jobs Router
app.use("/api/v1/jobs", authenticateUser, jobRouter);

// Middleware invokes
// Signals that im looking for all the TP methods
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

// If the connection to the database is successful --> Run the server
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => {
      console.log(`Server is listening on port : ${port}...`);
    });
    // If not show the error
  } catch (error) {
    console.log(error);
  }
};

start();
