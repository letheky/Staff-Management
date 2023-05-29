const { Employee } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const {
      employeeName,
      dob,
      gender,
      address,
      phoneNum,
      email,
      joiningDate,
      type,
      salary,
      insuranceContribution,
      isHighLevelTeacher,
    } = req.body;

    await Employee.create({
      employeeName,
      dob,
      gender,
      address,
      phoneNum,
      email,
      joiningDate,
      type,
      salary,
      insuranceContribution,
      isHighLevelTeacher,
      isActive:true,
    });

    res.status(201).json({ message: "Employee created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const {
      employeeID,
      employeeName,
      dob,
      gender,
      address,
      phoneNum,
      email,
      joiningDate,
      type,
      salary,
      insuranceContribution,
      isHighLevelTeacher,
      isActive,
    } = req.body;

    const employee = await Employee.findByPk(employeeID);

    if (!employee) {
      return res.status(404).send("Employee not found");
    }

    await Employee.update({
      employeeID,
      employeeName,
      dob,
      gender,
      address,
      phoneNum,
      email,
      joiningDate,
      type,
      salary,
      insuranceContribution,
      isHighLevelTeacher,
      isActive,
    });

    res.status(201).json({ message: "Employee edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deleteEmployee =
  ("/",
  async (req, res) => {
    try {
      const { employeeID } = req.query;

      if (!employeeID) {
        return res
          .status(400)
          .json({ message: "employeeID parameter is required" });
      }

      const numDeleted = await Employee.destroy({ where: { employeeID } });

      if (numDeleted === 0) {
        return res.status(404).json({
          message: `No Employee with employeeID=${employeeID} was found`,
        });
      }

      res.json({
        message: `Employee with employeeID=${employeeID} was deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", employeeID });
    }
  });

const deActive =
  ("/",
  async (req, res) => {
    try {
      const { employeeID } = req.query;

      const employee = await Employee.findByPk(employeeID);

      if (!employee) {
        return res.status(404).json({ error: "Employee not found" });
      }

      employee.isActive = false;
      await employee.save();

      res.json({ message: "Employee deactive successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", employeeID });
    }
  });

const getAll = async (req, res) => {
  try {
    const Employees = await Employee.findAll();
    res.status(200).json(Employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const getAllActive = async (req, res) => {
  try {
    const employees = await Employee.findAll({
      where: {
        isActive: true,
      },
    });
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
// const getStudentInResearch = async (req, res) => {
//   try {
//     // Find all researches
//     const Employees = await Employee.findAll();

//     // Extract the member and leader student IDs from all researches
//     const studentNames = [];
//     Employees.forEach((Employee) => {
//       const memberStudentNames = Employee.members.split(",");
//       const leaderStudentName = Employee.leaderName;
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

const getEmployeeByID =
  ("/",
  async (req, res) => {
    try {
      const { employeeID } = req.query;

      if (!employeeID) {
        return res
          .status(400)
          .json({ message: "employeeID parameter is required" });
      }
      const whereClause = {};

      if (employeeID) {
        whereClause.employeeID = {
          [Op.like]: `%${employeeID}%`,
        };
      }

      const employee = await Employee.findAll({ where: whereClause });
      res.json(employee);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deleteEmployee,
  getAll,
  getEmployeeByID,
  deActive,
  getAllActive,
  // getStudentInResearch,
};
