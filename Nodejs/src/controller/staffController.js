const { Staff } = require("../models");
const { Employee } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const { employeeID, role } = req.body;

    await Staff.create({
      employeeID,
      role,
    });

    res.status(201).json({ message: "Staff created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const { staffID, employeeID, role } = req.body;

    const staff = await Staff.findByPk(staffID);

    if (!staff) {
      return res.status(404).send("Staff not found");
    }

    await staff.update({
      staffID,
      employeeID,
      role,
    });

    res.status(201).json({ message: "Staff edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deleteStaff =
  ("/",
  async (req, res) => {
    try {
      const { staffID } = req.query;

      if (!staffID) {
        return res
          .status(400)
          .json({ message: "staffID parameter is required" });
      }

      const numDeleted = await Staff.destroy({ where: { staffID } });

      if (numDeleted === 0) {
        return res.status(404).json({
          message: `No Staff with staffID=${staffID} was found`,
        });
      }

      res.json({
        message: `Staff with staffID=${staffID} was deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", staffID });
    }
  });

const getAll = async (req, res) => {
  try {
    const staffs = await Staff.findAll({ include: [{ model: Employee }] });
    res.json(staffs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
// const getStudentInResearch = async (req, res) => {
//   try {
//     // Find all researches
//     const Staffs = await Staff.findAll();

//     // Extract the member and leader student IDs from all researches
//     const studentNames = [];
//     Staffs.forEach((Staff) => {
//       const memberStudentNames = Staff.members.split(",");
//       const leaderStudentName = Staff.leaderName;
//       studentNames.push(...memberStudentNames, leaderStudentName);
//     });

//     // Find the students by their IDs in the database
//     const students = await Student.findAll({
//       where: {
//         studentName: studentNames,
//       },
//     });

//     res.status(200).json(students);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Internal server error", error: error });
//   }
// };

const getStaffByID =
  ("/",
  async (req, res) => {
    try {
      const { staffID } = req.query;

      if (!staffID) {
        return res
          .status(400)
          .json({ message: "staffID parameter is required" });
      }
      const whereClause = {};

      if (staffID) {
        whereClause.staffID = {
          [Op.like]: `%${staffID}%`,
        };
      }

      const staff = await Staff.findAll({
        where: whereClause,
        include: [{ model: Employee }],
      });
      res.json(staff);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deleteStaff,
  getAll,
  getStaffByID,
  // getStudentInResearch,
};
