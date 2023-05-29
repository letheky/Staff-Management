const { Contract } = require("../models");
const { Employee } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const { employeeID, contractType, startDate, endDate } = req.body;

    await Contract.create({
      employeeID,
      contractType,
      startDate,
      endDate,
    });

    res.status(201).json({ message: "Contract created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const { contractID, employeeID, contractType, startDate, endDate } =
      req.body;

    const contract = await Contract.findByPk(contractID);

    if (!contract) {
      return res.status(404).send("Contract not found");
    }

    await Contract.update({
      contractID,
      employeeID,
      contractType,
      startDate,
      endDate,
    });

    res.status(201).json({ message: "Contract edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deleteContract =
  ("/",
  async (req, res) => {
    try {
      const { contractID } = req.query;

      if (!contractID) {
        return res
          .status(400)
          .json({ message: "contractID parameter is required" });
      }

      const numDeleted = await Contract.destroy({ where: { contractID } });

      if (numDeleted === 0) {
        return res.status(404).json({
          message: `No Contract with contractID=${contractID} was found`,
        });
      }

      res.json({
        message: `Contract with contractID=${contractID} was deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", contractID });
    }
  });

const getAll = async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      include: [{ model: Employee }],
    });
    res.json(contracts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
// const getStudentInResearch = async (req, res) => {
//   try {
//     // Find all researches
//     const Contracts = await Contract.findAll();

//     // Extract the member and leader student IDs from all researches
//     const studentNames = [];
//     Contracts.forEach((Contract) => {
//       const memberStudentNames = Contract.members.split(",");
//       const leaderStudentName = Contract.leaderName;
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

const getContractByID =
  ("/",
  async (req, res) => {
    try {
      const { contractID } = req.query;

      if (!contractID) {
        return res
          .status(400)
          .json({ message: "contractID parameter is required" });
      }
      const whereClause = {};

      if (contractID) {
        whereClause.contractID = {
          [Op.like]: `%${contractID}%`,
        };
      }

      const contract = await Contract.findAll({
        where: whereClause,
        include: [{ model: Employee }],
      });
      res.json(contract);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deleteContract,
  getAll,
  getContractByID,
  // getStudentInResearch,
};
