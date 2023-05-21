const userService = require("../services/userService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models");


const register = async (req, res) => {
  const { username, roleid, password } = req.body;

  try {
    // Check if user with email already exists
    const existingUser = await User.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({status, message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create user in database
    const newUser = await User.create({
      username,
      image:req.file.path,
      roleid,
      password: hashedPassword,
      accountTypeName: getAccountType(roleid),
    });

    // Create JWT token
    const token = jwt.sign({ userID: newUser.userID }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(201).json({ message: "User created", newUser , token });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err });
  }
};

const login = async (req, res) => {
  const username = await req.body.username;
  const password = await req.body.password;

  if (!username || !password) {
    return res.status(400).json({
      errCode: 1,
      message: "Missing input params",
      username,
      password,
    });
  }

  const userData = await userService.handleUserLogin(username, password);
  const token = jwt.sign({ userID: userData.userID }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return res.status(200).json({
    errCode: userData.errCode,
    message: userData.errMessage,
    user: userData.user ? { ...userData.user, token: token } : {},
  });
};

// Change password controller
const changePassword = async (req, res) => {
  try {

    // Hash the new password
    const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
    const user = await User.findOne({ where: { userID: req.body.userID } });
    // Update the user's password in the database (or wherever it's stored)
    user.password = hashedPassword;

    res.status(200).json({ message: "Change password success" });
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
};

const getAll = async (req, res) => {
  try {
    const Users = await User.findAll();
    res.status(200).json(Users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deleteUser =
  ("/",
  async (req, res) => {
    try {
        const { userID } = req.query;
    
        if (!userID) {
          return res.status(400).json({ message: 'userID parameter is required' });
        }
    
        const numDeleted = await User.destroy({ where: { userID } });
    
        if (numDeleted === 0) {
          return res.status(404).json({ message: `No Student with userID=${userID} was found` });
        }
    
        res.json({ message: `Student with userID=${userID} was deleted successfully` });
      } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", userID });
    }
  });


  
function getAccountType(roleId) {
  switch (Number(roleId)) {
    case 1:
      return "admin";
    case 2:
      return "teacher";
    case 3:
      return "student";
    default:
      return null;
  }
}

module.exports = {
  register,
  login,
  changePassword,
  getAll,
  deleteUser,
};
