const { Promotion } = require("../models");
const { Employee } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const { employeeID, achievement, degree, actualDate, realDate } = req.body;

    await Promotion.create({
      employeeID,
      achievement,
      degree,
      actualDate,
      realDate,
    });

    res.status(201).json({ message: "Promotion created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const {
      promotionID,
      employeeID,
      achievement,
      degree,
      actualDate,
      realDate,
    } = req.body;

    const promotion = await Promotion.findByPk(promotionID);

    if (!promotion) {
      return res.status(404).send("Promotion not found");
    }

    await promotion.update({
      promotionID,
      employeeID,
      achievement,
      degree,
      actualDate,
      realDate,
    });

    res.status(201).json({ message: "Promotion edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deletePromotion =
  ("/",
  async (req, res) => {
    try {
      const { promotionID } = req.query;

      if (!promotionID) {
        return res
          .status(400)
          .json({ message: "promotionID parameter is required" });
      }

      const numDeleted = await Promotion.destroy({ where: { promotionID } });

      if (numDeleted === 0) {
        return res.status(404).json({
          message: `No Promotion with promotionID=${promotionID} was found`,
        });
      }

      res.json({
        message: `Promotion with promotionID=${promotionID} was deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", promotionID });
    }
  });

const getAll = async (req, res) => {
  try {
    const promotions = await Promotion.findAll({
      include: [{ model: Employee }],
    });
    res.json(promotions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};
// const getStudentInResearch = async (req, res) => {
//   try {
//     // Find all researches
//     const Promotions = await Promotion.findAll();

//     // Extract the member and leader student IDs from all researches
//     const studentNames = [];
//     Promotions.forEach((Promotion) => {
//       const memberStudentNames = Promotion.members.split(",");
//       const leaderStudentName = Promotion.leaderName;
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

const getPromotionByID =
  ("/",
  async (req, res) => {
    try {
      const { promotionID } = req.query;

      if (!promotionID) {
        return res
          .status(400)
          .json({ message: "promotionID parameter is required" });
      }
      const whereClause = {};

      if (promotionID) {
        whereClause.promotionID = {
          [Op.like]: `%${promotionID}%`,
        };
      }

      const promotion = await Promotion.findAll({
        where: whereClause,
        include: [{ model: Employee }],
      });
      res.json(promotion);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deletePromotion,
  getAll,
  getPromotionByID,
  // getStudentInResearch,
};
