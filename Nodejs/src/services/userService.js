const { User } = require("../models");
import bcrypt from "bcrypt";

const handleUserLogin = (username, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = {};

      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        const user = await User.findOne({
          attributes: [
            "username",
            "roleid",
            "userID",
            "accountTypeName",
            "password",
          ],
          where: { username: username },
          raw: true,
        });
        if (user) {
          const check = await bcrypt.compareSync(password, user.password);
          if (check) {
            userData.errCode = 0;
            userData.errMessage = "Ok";

            delete user.password;
            userData.user = user;
          } else {
            userData.errCode = 3;
            userData.errMessage = "Wrong username and password";
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = "User is not found";
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `Username isn't exist`;
      }
      resolve(userData);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = {
  handleUserLogin,
};
