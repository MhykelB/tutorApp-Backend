const jwt = require("jsonwebtoken");

const authenticateToken = async (req, res, next) => {
  const reqHeaders = req.headers.authorization;
  if (!reqHeaders || reqHeaders === "") {
    throw new Error("token not provided");
  }
  if (reqHeaders.startsWith("Bearer ")) {
    const token = reqHeaders.split(" ")[1];
    //  verify token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    if (decodedToken) {
      const { userID, username } = decodedToken;
      req.user = { userID, username }; // on getting all comments, send this to the front end to customize the page for the user and also for diff requests
      return next();
    }
  }
  throw new Error("Not authorized to access this route, sorry ehn");
};

module.exports = authenticateToken;
