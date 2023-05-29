const { LeaveRequest } = require("../models");
const { Employee } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const { employeeID, requestDate, leaveType, startDate, endDate } = req.body;

    await LeaveRequest.create({
      employeeID,
      requestDate,
      leaveType,
      startDate,
      endDate,
    });

    res.status(201).json({ message: "LeaveRequest created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const {
      leaveRequestID,
      employeeID,
      requestDate,
      leaveType,
      startDate,
      endDate,
    } = req.body;

    const leaveRequest = await LeaveRequest.findByPk(leaveRequestID);

    if (!leaveRequest) {
      return res.status(404).send("LeaveRequest not found");
    }

    await LeaveRequest.update({
      leaveRequestID,
      employeeID,
      requestDate,
      leaveType,
      startDate,
      endDate,
    });

    res.status(201).json({ message: "LeaveRequest edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deleteLeaveRequest =
  ("/",
  async (req, res) => {
    try {
      const { leaveRequestID } = req.query;

      if (!leaveRequestID) {
        return res
          .status(400)
          .json({ message: "leaveRequestID parameter is required" });
      }

      const numDeleted = await LeaveRequest.destroy({
        where: { leaveRequestID },
      });

      if (numDeleted === 0) {
        return res.status(404).json({
          message: `No LeaveRequest with leaveRequestID=${leaveRequestID} was found`,
        });
      }

      res.json({
        message: `LeaveRequest with leaveRequestID=${leaveRequestID} was deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Internal server error", leaveRequestID });
    }
  });

const getAll = async (req, res) => {
  try {
    const leaveRequests = await LeaveRequest.findAll({include: [{ model: Employee }]});
    res.json(leaveRequests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
// const getStudentInResearch = async (req, res) => {
//   try {
//     // Find all researches
//     const LeaveRequests = await LeaveRequest.findAll();

//     // Extract the member and leader student IDs from all researches
//     const studentNames = [];
//     LeaveRequests.forEach((LeaveRequest) => {
//       const memberStudentNames = LeaveRequest.members.split(",");
//       const leaderStudentName = LeaveRequest.leaderName;
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

const getLeaveRequestByID =
  ("/",
  async (req, res) => {
    try {
      const { leaveRequestID } = req.query;

      if (!leaveRequestID) {
        return res
          .status(400)
          .json({ message: "leaveRequestID parameter is required" });
      }
      const whereClause = {};

      if (leaveRequestID) {
        whereClause.leaveRequestID = {
          [Op.like]: `%${leaveRequestID}%`,
        };
      }

      const leaveRequest = await LeaveRequest.findAll({ where: whereClause,include: [{ model: Employee }] });
      res.json(leaveRequest);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deleteLeaveRequest,
  getAll,
  getLeaveRequestByID,
  // getStudentInResearch,
};
