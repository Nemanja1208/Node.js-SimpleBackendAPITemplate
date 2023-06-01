const jwt = require("jsonwebtoken");

function verifyToken() {
  try {
    const { user } = jwt.verify(
      process.env.JWT_AUTHORIZE_TOKEN,
      process.env.RANDOM_JWT_SECRET
    );
    return user;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

module.exports = { verifyToken };
