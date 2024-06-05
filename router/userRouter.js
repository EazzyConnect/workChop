const {
  signUp,
  getAllUsers,
  getSpecificUsers,
  deleteOneUser,
  login,
} = require("../controller/userController");

const express = require("express"),
  router = express.Router();

// SignUp
router.post("/register", signUp);

// Get all users
router.get("/search", getAllUsers);

// Get a user
router.post("/search/user", getSpecificUsers);

// Login
router.post("/login", login);

// Delete a user
router.delete("/search/delete", deleteOneUser);

module.exports = router;
