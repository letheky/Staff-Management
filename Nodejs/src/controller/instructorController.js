const { Instructor } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const {
      instructor_userID,
      instructorName,
      dob,
      gender,
      academicDegree,
      address,
      moralEducation,
      major,
      phoneNum,
    } = req.body;
    const existingInstructor = await Instructor.findOne({
      where: { instructor_userID },
    });
    if (existingInstructor) {
      return res.status(409).json({ message: "Instructor already exists" });
    }
    await Instructor.create({
      instructor_userID,
      instructorName,
      dob,
      gender,
      academicDegree,
      address,
      moralEducation,
      major,
      phoneNum,
    });

    res.status(201).json({ message: "Instructor created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const {
      instructorID,
      instructorName,
      dob,
      gender,
      academicDegree,
      address,
      moralEducation,
      major,
      phoneNum,
    } = req.body;

    const instructor = await Instructor.findByPk(instructorID);

    if (!instructor) {
      return res.status(404).send("Instructor not found");
    }

    await instructor.update({
      instructorName,
      dob,
      gender,
      academicDegree,
      address,
      moralEducation,
      major,
      phoneNum,
    });

    res.status(201).json({ message: "Instructor edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deleteInstructor =
  ("/",
  async (req, res) => {
    try {
        const { instructorID } = req.query;
    
        if (!instructorID) {
          return res.status(400).json({ message: 'instructorID parameter is required' });
        }
    
        const numDeleted = await Instructor.destroy({ where: { instructorID } });
    
        if (numDeleted === 0) {
          return res.status(404).json({ message: `No instructor with instructorID=${instructorID} was found` });
        }
    
        res.json({ message: `Instructor with instructorID=${instructorID} was deleted successfully` });
      } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", instructorID });
    }
  });

const getAll = async (req, res) => {
  try {
    const instructors = await Instructor.findAll();
    res.json(instructors);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const getInstructorByID =
  ("/",
  async (req, res) => {
    try {
      const { instructorID } = req.query;
      
      if (!instructorID) {
        return res.status(400).json({ message: 'instructorID parameter is required' });
      }
      const whereClause = {};

      if (instructorID) {
        whereClause.instructorID = {
          [Op.like]: `%${instructorID}%`,
        };
      }

      const instructor = await Instructor.findAll({ where: whereClause });
      res.json(instructor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

const getInstructorByUserID =
  ("/",
  async (req, res) => {
    try {
      const { instructor_userID } = req.query;
      
      if (!instructor_userID) {
        return res.status(400).json({ message: 'instructor_userID parameter is required' });
      }
      const whereClause = {};

      if (instructor_userID) {
        whereClause.instructor_userID = {
          [Op.like]: `%${instructor_userID}%`,
        };
      }

      const instructor = await Instructor.findAll({ where: whereClause });
      res.json(instructor);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deleteInstructor,
  getAll,
  getInstructorByID,
  getInstructorByUserID
};
