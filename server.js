import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import "express-async-errors";
import morgan from "morgan";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
// Security Packages
import helmet from "helmet";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";
// Our Cookie import
import cookieParser from "cookie-parser";

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

// Our Cookie Middleware
app.use(cookieParser());

// Security Packages
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static(path.resolve(__dirname, "./client/build")));

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

// If the two above fail we want to resolve to this
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

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
