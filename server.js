import express from "express";
const app = express();

// Middleware
import notFoundMiddleware from "./middleware/not-found.js";

app.get("/", (req, res) => {
  res.send("Welcome");
});

// Middleware invokes
// Signals that im looking for all the TP methods
app.use(notFoundMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is listening on port : ${port}...`);
});
