const { Plan } = require("../models");
const { Employee } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const {
      employeeID,
      position,
      upcomingPosition,
      trainingCourse,
      startDate,
      endDate,
    } = req.body;

    await Plan.create({
      employeeID,
      position,
      upcomingPosition,
      trainingCourse,
      startDate,
      endDate,
    });

    res.status(201).json({ message: "Plan created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const {
      planID,
      employeeID,
      position,
      upcomingPosition,
      trainingCourse,
      startDate,
      endDate,
    } = req.body;

    const plan = await Plan.findByPk(planID);

    if (!plan) {
      return res.status(404).send("Plan not found");
    }

    await plan.update({
      planID,
      employeeID,
      position,
      upcomingPosition,
      trainingCourse,
      startDate,
      endDate,
    });

    res.status(201).json({ message: "Plan edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deletePlan =
  ("/",
  async (req, res) => {
    try {
      const { planID } = req.query;

      if (!planID) {
        return res
          .status(400)
          .json({ message: "planID parameter is required" });
      }

      const numDeleted = await Plan.destroy({ where: { planID } });

      if (numDeleted === 0) {
        return res.status(404).json({
          message: `No Plan with planID=${planID} was found`,
        });
      }

      res.json({
        message: `Plan with planID=${planID} was deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", planID });
    }
  });

const getAll = async (req, res) => {
  try {
    const plans = await Plan.findAll({ include: [{ model: Employee }] });
    res.json(plans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
// const getStudentInResearch = async (req, res) => {
//   try {
//     // Find all researches
//     const Plans = await Plan.findAll();

//     // Extract the member and leader student IDs from all researches
//     const studentNames = [];
//     Plans.forEach((Plan) => {
//       const memberStudentNames = Plan.members.split(",");
//       const leaderStudentName = Plan.leaderName;
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

const getPlanByID =
  ("/",
  async (req, res) => {
    try {
      const { planID } = req.query;

      if (!planID) {
        return res
          .status(400)
          .json({ message: "planID parameter is required" });
      }
      const whereClause = {};

      if (planID) {
        whereClause.planID = {
          [Op.like]: `%${planID}%`,
        };
      }

      const plan = await Plan.findAll({
        where: whereClause,
        include: [{ model: Employee }],
      });
      res.json(plan);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deletePlan,
  getAll,
  getPlanByID,
  // getStudentInResearch,
};
