const { Paper } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const {
      paperTitle,
      paperContent,
      paperType,
      publicDate,
      authors
    } = req.body;

    await Paper.create({
      paperTitle,
      paperContent,
      paperType,
      publicDate,
      authors
    });

    res.status(201).json({ message: "Paper created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const {
        paperID,
        paperTitle,
        paperContent,
        paperType,
        publicDate,
        authors,
      } = req.body;

    const paper = await Paper.findByPk(paperID);

    if (!paper) {
      return res.status(404).send("Paper not found");
    }

    await paper.update({
        paperTitle,
        paperTitle,
        paperContent,
        paperType,
        publicDate,
        authors,
    });

    res.status(201).json({ message: "Paper edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deletePaper =
  ("/",
  async (req, res) => {
    try {
      const { paperID } = req.query;

      if (!paperID) {
        return res
          .status(400)
          .json({ message: "paperID parameter is required" });
      }

      const numDeleted = await Paper.destroy({ where: { paperID } });

      if (numDeleted === 0) {
        return res.status(404).json({
          message: `No Paper with paperID=${paperID} was found`,
        });
      }

      res.json({
        message: `Paper with paperID=${paperID} was deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", paperID });
    }
  });

const getAll = async (req, res) => {
  try {
    const Papers = await Paper.findAll();
    res.json(Papers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const getPaperByID =
  ("/",
  async (req, res) => {
    try {
      const { paperID } = req.query;

      if (!paperID) {
        return res
          .status(400)
          .json({ message: "paperID parameter is required" });
      }
      const whereClause = {};

      if (paperID) {
        whereClause.paperID = {
          [Op.like]: `%${paperID}%`,
        };
      }

      const paper = await Paper.findAll({ where: whereClause });
      res.json(paper);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deletePaper,
  getAll,
  getPaperByID,
};
