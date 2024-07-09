const express = require("express");
const  app = express();
const connectDb = require("./config/db");
require("dotenv").config();
const chatRouter = require("./routes/ChatRoute");
const { errorHandler } = require("./middleware/ErrorMiddleware");
const cors = require("cors");


app.use(express.json());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

connectDb();

app.use("/api/chat", chatRouter);

app.get("/", (req, res) => {
  res.status(200).json({
    message: `Welcome to ${process.env.APP_NAME} ${process.env.API_VERSION}`,
  });
});

app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port} ...`);
});