const express = require("express"),
  app = express();

const db = require("./model/dbConfig");
const userRouter = require("./router/userRouter");
require("express-async-errors"); //Global error handler

// Middleware
app.use(express.json());
app.use("/", userRouter);

// Global Error handler. Where try and catch isn't used, this would handle the error.
app.use((err, req, res, next) => {
  console.log(`MidError: `, err);
  return res.status(err.status || 500).send("An error just occured.");
});

const startServer = async () => {
  try {
    await db
      .query("SELECT * FROM workchop_db.artisans")
      .then(() => console.log("db connected"))
      .catch((err) => console.log("db connection failed! " + err));
    app.listen(3555, () => console.log("Server running on 3555!"));
  } catch (error) {
    console.log(`error: `, error);
  }
};

startServer();
