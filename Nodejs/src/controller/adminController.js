const { Admin } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const { admin_userID, adminName, dob, gender, address, phoneNum } =
      req.body;
    const existingAdmin = await Admin.findOne({
      where: { admin_userID },
    });
    if (existingAdmin) {
      return res.status(409).json({ message: "Admin already exists" });
    }
    await Admin.create({
      admin_userID,
      adminName,
      dob,
      gender,
      address,
      phoneNum,
    });

    res.status(201).json({ message: "Admin created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const { adminID, adminName, dob, gender, address, phoneNum } = req.body;

    const admin = await Admin.findByPk(adminID);

    if (!admin) {
      return res.status(404).send("Admin not found");
    }

    await admin.update({
      adminName,
      dob,
      gender,
      address,
      phoneNum,
    });

    res.status(201).json({ message: "Admin edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deleteAdmin =
  ("/",
  async (req, res) => {
    try {
      const { adminID } = req.query;

      if (!adminID) {
        return res
          .status(400)
          .json({ message: "adminID parameter is required" });
      }

      const numDeleted = await Admin.destroy({ where: { adminID } });

      if (numDeleted === 0) {
        return res
          .status(404)
          .json({ message: `No Admin with adminID=${adminID} was found` });
      }

      res.json({
        message: `Admin with adminID=${adminID} was deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", adminID });
    }
  });

const getAll = async (req, res) => {
  try {
    const Admins = await Admin.findAll();
    res.json(Admins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const getAdminByID =
  ("/",
  async (req, res) => {
    try {
      const { adminID } = req.query;

      if (!adminID) {
        return res
          .status(400)
          .json({ message: "adminID parameter is required" });
      }
      const whereClause = {};

      if (adminID) {
        whereClause.adminID = {
          [Op.like]: `%${adminID}%`,
        };
      }

      const admin = await Admin.findAll({ where: whereClause });
      res.json(admin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

const getAdminByUserID =
  ("/",
  async (req, res) => {
    try {
      const { admin_userID } = req.query;

      if (!admin_userID) {
        return res
          .status(400)
          .json({ message: "admin_userID parameter is required" });
      }
      const whereClause = {};

      if (admin_userID) {
        whereClause.admin_userID = {
          [Op.like]: `%${admin_userID}%`,
        };
      }

      const admin = await Admin.findAll({ where: whereClause });
      res.json(admin);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deleteAdmin,
  getAll,
  getAdminByID,
  getAdminByUserID
};
