const jwt = require("jsonwebtoken");
const { User } = require("../models");

const verifyUserToken = (req, res, next) => {
  let token = req.headers.authorization;
  if (!token)
    return res.status(401).send("Access Denied / Unauthorized request");

  try {
    token = token.split(" ")[1]; // Remove Bearer from string

    if (token === "null" || !token)
      return res.status(401).send("Unauthorized request");

    let verifiedUser = jwt.verify(token, process.env.JWT_SECRET); // config.TOKEN_SECRET => 'secretKey'
    if (!verifiedUser) return res.status(401).send("Unauthorized request");

    req.user = verifiedUser; // user_id & user_type_id
    next();
  } catch (error) {
    res.status(403).send("Invalid Token");
  }
};
const IsStudent = async (req, res, next) => {
  if (req.user.roleid === 3) {
    next();
  }
  return res.status(401).send("Unauthorized!");
};
const IsTeacher = async (req, res, next) => {
  if (req.user.roleid === 2) {
    next();
  }
  return res.status(401).send("Unauthorized!");
};
const IsAdmin = async (req, res, next) => {
  if (req.user.roleid === 1) {
    next();
  }
  return res.status(401).send("Unauthorized!");
};
const IsAdminOrTeacher = async (req, res, next) => {
  if (req.user.roleid === 1 || req.user.roleid === 2) {
    next();
  }
  return res.status(401).send("Unauthorized!");
};

module.exports = {
  verifyUserToken,
  IsStudent,
  IsTeacher,
  IsAdmin,
  IsAdminOrTeacher
};
