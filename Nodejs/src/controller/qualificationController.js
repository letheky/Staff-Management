const { Qualification } = require("../models");
const { Employee } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const { employeeID, degree, field, institution, yearCompleted } = req.body;

    await Qualification.create({
      employeeID,
      degree,
      field,
      institution,
      yearCompleted,
    });

    res.status(201).json({ message: "Qualification created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const {
      qualificationID,
      employeeID,
      degree,
      field,
      institution,
      yearCompleted,
    } = req.body;

    const qualification = await Qualification.findByPk(qualificationID);

    if (!qualification) {
      return res.status(404).send("Qualification not found");
    }

    await qualification.update({
      qualificationID,
      employeeID,
      degree,
      field,
      institution,
      yearCompleted,
    });

    res.status(201).json({ message: "Qualification edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deleteQualification =
  ("/",
  async (req, res) => {
    try {
      const { qualificationID } = req.query;

      if (!qualificationID) {
        return res
          .status(400)
          .json({ message: "qualificationID parameter is required" });
      }

      const numDeleted = await Qualification.destroy({
        where: { qualificationID },
      });

      if (numDeleted === 0) {
        return res.status(404).json({
          message: `No Qualification with qualificationID=${qualificationID} was found`,
        });
      }

      res.json({
        message: `Qualification with qualificationID=${qualificationID} was deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal server error", qualificationID });
    }
  });

const getAll = async (req, res) => {
  try {
    const qualifications = await Qualification.findAll({
      include: [{ model: Employee }],
    });
    res.json(qualifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
// const getStudentInResearch = async (req, res) => {
//   try {
//     // Find all researches
//     const Qualifications = await Qualification.findAll();

//     // Extract the member and leader student IDs from all researches
//     const studentNames = [];
//     Qualifications.forEach((Qualification) => {
//       const memberStudentNames = Qualification.members.split(",");
//       const leaderStudentName = Qualification.leaderName;
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

const getQualificationByID =
  ("/",
  async (req, res) => {
    try {
      const { qualificationID } = req.query;

      if (!qualificationID) {
        return res
          .status(400)
          .json({ message: "qualificationID parameter is required" });
      }
      const whereClause = {};

      if (qualificationID) {
        whereClause.qualificationID = {
          [Op.like]: `%${qualificationID}%`,
        };
      }

      const qualification = await Qualification.findAll({
        where: whereClause,
        include: [{ model: Employee }],
      });
      res.json(qualification);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deleteQualification,
  getAll,
  getQualificationByID,
  // getStudentInResearch,
};
