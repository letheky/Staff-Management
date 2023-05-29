const { Department } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const { departmentName, address, phoneNum } = req.body;

    await Department.create({
      departmentName,
      address,
      phoneNum,
    });

    res.status(201).json({ message: "Department created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const { departmentID, departmentName, address, phoneNum } = req.body;

    const department = await Department.findByPk(departmentID);

    if (!department) {
      return res.status(404).send("Department not found");
    }

    await Department.update({
      departmentID,
      departmentName,
      address,
      phoneNum,
    });

    res.status(201).json({ message: "Department edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deleteDepartment =
  ("/",
  async (req, res) => {
    try {
      const { departmentID } = req.query;

      if (!departmentID) {
        return res
          .status(400)
          .json({ message: "departmentID parameter is required" });
      }

      const numDeleted = await Department.destroy({ where: { departmentID } });

      if (numDeleted === 0) {
        return res.status(404).json({
          message: `No Department with departmentID=${departmentID} was found`,
        });
      }

      res.json({
        message: `Department with departmentID=${departmentID} was deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", departmentID });
    }
  });

const getAll = async (req, res) => {
  try {
    const departments = await Department.findAll();
    res.json(departments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
// const getStudentInResearch = async (req, res) => {
//   try {
//     // Find all researches
//     const Departments = await Department.findAll();

//     // Extract the member and leader student IDs from all researches
//     const studentNames = [];
//     Departments.forEach((Department) => {
//       const memberStudentNames = Department.members.split(",");
//       const leaderStudentName = Department.leaderName;
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

const getDepartmentByID =
  ("/",
  async (req, res) => {
    try {
      const { departmentID } = req.query;

      if (!departmentID) {
        return res
          .status(400)
          .json({ message: "departmentID parameter is required" });
      }
      const whereClause = {};

      if (departmentID) {
        whereClause.departmentID = {
          [Op.like]: `%${departmentID}%`,
        };
      }

      const department = await Department.findAll({ where: whereClause });
      res.json(department);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deleteDepartment,
  getAll,
  getDepartmentByID,
  // getStudentInResearch,
};
