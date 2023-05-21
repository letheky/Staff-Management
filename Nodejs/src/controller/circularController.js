const { Circular } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const { circularName, circularImage,circularType } = req.body;

    await Circular.create({
      circularName,
      circularImage,
      circularType,
    });

    res.status(201).json({ message: "Circular created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const { circularID, circularName, circularImage,circularType } = req.body;

    const circular = await Circular.findByPk(circularID);

    if (!circular) {
      return res.status(404).send("Circular not found");
    }

    await circular.update({
      circularType,
      circularName,
      circularImage,
    });

    res.status(201).json({ message: "Circular edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deleteCircular =
  ("/",
  async (req, res) => {
    try {
      const { circularID } = req.query;

      if (!circularID) {
        return res
          .status(400)
          .json({ message: "circularID parameter is required" });
      }

      const numDeleted = await Circular.destroy({ where: { circularID } });

      if (numDeleted === 0) {
        return res.status(404).json({
          message: `No Circular with circularID=${circularID} was found`,
        });
      }

      res.json({
        message: `Circular with circularID=${circularID} was deleted successfully`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", circularID });
    }
  });

const getAll = async (req, res) => {
  try {
    const Circulars = await Circular.findAll();
    res.json(Circulars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const getCircularByID =
  ("/",
  async (req, res) => {
    try {
      const { circularID } = req.query;

      if (!circularID) {
        return res
          .status(400)
          .json({ message: "circularID parameter is required" });
      }
      const whereClause = {};

      if (circularID) {
        whereClause.circularID = {
          [Op.like]: `%${circularID}%`,
        };
      }

      const circular = await Circular.findAll({ where: whereClause });
      res.json(circular);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deleteCircular,
  getAll,
  getCircularByID,
};
