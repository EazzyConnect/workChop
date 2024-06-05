const db = require("../model/dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// ******* SIGN-UP *********
module.exports.signUp = async (req, res) => {
  const {
    firstName,
    lastName,
    gender,
    email,
    phone,
    category,
    about,
    location,
    password,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !gender ||
    !email ||
    !phone ||
    !category ||
    !about ||
    !location ||
    !password
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all fields", success: false });
  }

  try {
    // Check if email exists
    const [checkEmail] = await db.query(
      "SELECT * FROM artisans WHERE email = ?",
      [email]
    );
    if (checkEmail.length > 0) {
      return res.status(400).json({
        message: "Email already exists. Try another email",
        success: false,
      });
    }

    // Check if phone exists
    const [checkPhone] = await db.query(
      "SELECT * FROM artisans WHERE phone = ?",
      [phone]
    );
    if (checkPhone.length > 0) {
      return res.status(400).json({
        message: "Phone already exists. Try another phone",
        success: false,
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert new user
    await db.query(
      "INSERT INTO artisans (firstName, lastName, gender, email, phone, category, about, location, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        firstName,
        lastName,
        gender,
        email,
        phone,
        category,
        about,
        location,
        hashedPassword,
      ]
    );

    return res
      .status(201)
      .json({ message: "User registered successfully", success: true });
  } catch (error) {
    console.log(`Error: `, error);
    return res
      .status(500)
      .json({ message: "An error occurred", success: false });
  }
};

// ******* GET ALL USERS **********
module.exports.getAllUsers = async (req, res) => {
  try {
    // Destructure the response and select only the first array which contains the actual data.
    const [users] = await db.query(
      "SELECT firstName, lastName, gender, email, phone, category, about, location FROM workchop_db.artisans"
    );
    if (users.length === 0) {
      return res.status(404).json({ message: "No user found", success: false });
    } else {
      return res.status(200).json({ message: users, success: true });
    }
  } catch (error) {
    console.log(`Error: `, error);
    return res
      .status(500)
      .json({ message: "An error occured", success: false });
  }
};

// ******** GET SPECIFIED USER (SEARCH BY CATEGORY & LOCATION) **********
module.exports.getSpecificUsers = async (req, res) => {
  const { category, location } = req.body;
  if (!category || !location) {
    return res.status(400).json({
      message: "Please provide both category and location",
      success: false,
    });
  }
  try {
    const [user] = await db.query(
      "SELECT firstName, lastName, gender, email, phone, category, about, location FROM workchop_db.artisans WHERE category = ? AND location = ?",
      [category, location]
    );
    if (user.length == 0) {
      return res.status(404).json({ message: "No user found", success: false });
    } else {
      return res.status(200).json({ message: user, success: true });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occured", success: false });
  }
};

// ******* LOGIN **********
module.exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please enter email and password", success: false });
  }
  try {
    const [users] = await db.query(
      "SELECT * FROM workchop_db.artisans WHERE email = ?",
      email
    );
    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "Authentication Error ⚠️", success: false });
    }
    const user = users[0];
    const confirmPassword = await bcrypt.compare(password, user.password);
    if (!confirmPassword) {
      return res
        .status(400)
        .json({ message: "Authentication Error ⚠️", success: false });
    } else {
      const token = jwt.sign({ id: user.id }, process.env.MY_KEY, {
        expiresIn: "1h",
      });
      res.cookie("AccessKey", token, {
        httpOnly: true,
        secure: true,
        maxAge: 3600000, // 1-hour
      });
      // Exclude password from the response
      const { id, password, ...others } = user;
      return res.status(200).json({ data: others, success: true });
    }
  } catch (error) {
    console.log(`loginError: `, error);
    return res
      .status(500)
      .json({ message: "An error occured", success: false });
  }
};

// ******** DELETE A USER ************
module.exports.deleteOneUser = async (req, res) => {
  const { id } = req.body;
  // For indepth destructuring; const [{affectedRows}] can be used directly
  const [user] = await db.query(
    "DELETE FROM workchop_db.artisans WHERE id = ?",
    id
  );
  if (user.affectedRows == 0) {
    return res.status(404).json({ message: "No user found", success: false });
  } else {
    return res
      .status(200)
      .json({ message: "Delete successful", success: true });
  }
};

// ******** EDIT USER INFO ************
// module.exports.addOrEditUser = async (req,res) => {
//  const [{affectedRows}] = await db.query("CALL ")
// }
