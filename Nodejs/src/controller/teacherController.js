const { Teacher } = require("../models");
const { Employee } = require("../models");
const { Department } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const { departmentID, employeeID, courseTaught } = req.body;

    await Teacher.create({
      departmentID,
      employeeID,
      courseTaught,
    });

    res.status(201).json({ message: "Teacher created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const { teacherID, employeeID, departmentID, courseTaught } = req.body;

    const Teacher = await Teacher.findByPk(TeacherID);

    if (!Teacher) {
      return res.status(404).send("Teacher not found");
    }

    await Teacher.update({
      teacherID,
      employeeID,
      departmentID,
      courseTaught,
    });

    res.status(201).json({ message: "Teacher edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deleteTeacher =
  ("/",
  async (req, res) => {
    try {
      const { teacherID } = req.query;

      if (!teacherID) {
        return res
          .status(400)
          .json({ message: "teacherID parameter is required" });
      }

      const numDeleted = await Teacher.destroy({ where: { teacherID } });

      if (numDeleted === 0) {
        return res.status(404).json({
          message: `No Teacher with TeacherID=${TeacherID} was found`,
        });
      }

      res.json({
        message: `Teacher with TeacherID=${teacherID} was deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", teacherID });
    }
  });

const getAll = async (req, res) => {
  try {
    const teachers = await Teacher.findAll({
      include: [{ model: Department }, { model: Employee }],
    });
    res.json(teachers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
// const getStudentInResearch = async (req, res) => {
//   try {
//     // Find all researches
//     const Teachers = await Teacher.findAll();

//     // Extract the member and leader student IDs from all researches
//     const studentNames = [];
//     Teachers.forEach((Teacher) => {
//       const memberStudentNames = Teacher.members.split(",");
//       const leaderStudentName = Teacher.leaderName;
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

const getTeacherByID =
  ("/",
  async (req, res) => {
    try {
      const { teacherID } = req.query;

      if (!teacherID) {
        return res
          .status(400)
          .json({ message: "TeacherID parameter is required" });
      }
      const whereClause = {};

      if (teacherID) {
        whereClause.teacherID = {
          [Op.like]: `%${teacherID}%`,
        };
      }

      const teacher = await Teacher.findAll({
        where: whereClause,
        include: [{ model: Department }, { model: Employee }],
      });
      res.json(teacher);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deleteTeacher,
  getAll,
  getTeacherByID,
  // getStudentInResearch,
};
