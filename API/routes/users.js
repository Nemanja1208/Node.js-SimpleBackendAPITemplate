const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../../database/models/user");
const { verifyToken } = require("../../helpers/authentication/verifyToken");
require("dotenv").config();

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const newUser = new User({ username, password });

    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Failed to create this user" });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const allUsersFromDatabase = await User.find();

  console.log(`${username} is trying to login ..`);

  const userExistsAndHasRightCredentials = allUsersFromDatabase.find(
    (user) => user.username === username && user.password === password
  );

  if (!userExistsAndHasRightCredentials) {
    return res.status(401).json({
      message: "The username and/or password your provided are invalid",
    });
  }

  // Expiration time for the token
  const options = {
    expiresIn: "1h",
  };

  // Saving the jwt auth token locally so we can use it for other calls, can be done in localstorage later etc...
  process.env.JWT_AUTHORIZE_TOKEN = jwt.sign(
    { user: username },
    process.env.RANDOM_JWT_SECRET,
    options
  );

  console.log(`${username} is logged in ..`);

  return res.json({
    token: jwt.sign({ user: username }, process.env.RANDOM_JWT_SECRET, options),
  });
});

router.get("/super-secure-resource", (req, res) => {
  try {
    // Verify the token is valid
    const user = verifyToken();

    return res.status(200).json({
      message: `Congrats ${user}! You can now accesss the super secret resource`,
    });
  } catch (error) {
    return res.status(401).json({
      error:
        "This user does not have the valid credentials to access this API, please register or login first.",
    });
  }
});

module.exports = router;
