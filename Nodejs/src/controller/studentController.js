const { Student } = require("../models");
const { Op } = require("sequelize");

const create = async (req, res) => {
  try {
    const {
      stu_userID,
      studentName,
      dob,
      gender,
      academicDegree,
      address,
      classCode,
      major,
      phoneNum,
    } = req.body;
    const existingStudent = await Student.findOne({
      where: { stu_userID },
    });
    if (existingStudent) {
      return res.status(409).json({ message: "Student already exists" });
    }
    await Student.create({
      stu_userID,
      studentName,
      dob,
      gender,
      academicDegree,
      address,
      classCode,
      major,
      phoneNum,
    });

    res.status(201).json({ message: "Student created" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const put = async (req, res) => {
  try {
    const {
      studentID,
      studentName,
      dob,
      gender,
      academicDegree,
      address,
      classCode,
      major,
      phoneNum,
    } = req.body;

    const student = await Student.findByPk(studentID);

    if (!student) {
      return res.status(404).send("Student not found");
    }

    await student.update({
      studentName,
      dob,
      gender,
      academicDegree,
      address,
      classCode,
      major,
      phoneNum,
    });

    res.status(201).json({ message: "Student edited successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const deleteStudent =
  ("/",
  async (req, res) => {
    try {
        const { studentID } = req.query;
    
        if (!studentID) {
          return res.status(400).json({ message: 'studentID parameter is required' });
        }
    
        const numDeleted = await Student.destroy({ where: { studentID } });
    
        if (numDeleted === 0) {
          return res.status(404).json({ message: `No Student with studentID=${studentID} was found` });
        }
    
        res.json({ message: `Student with studentID=${studentID} was deleted successfully` });
      } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", studentID });
    }
  });

const getAll = async (req, res) => {
  try {
    const Students = await Student.findAll();
    res.json(Students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error", error: error });
  }
};

const getStudentByID =
  ("/",
  async (req, res) => {
    try {
      const { studentID } = req.query;
      
      if (!studentID) {
        return res.status(400).json({ message: 'studentID parameter is required' });
      }
      const whereClause = {};

      if (studentID) {
        whereClause.studentID = {
          [Op.like]: `%${studentID}%`,
        };
      }

      const student = await Student.findAll({ where: whereClause });
      res.json(student);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

const getStudentByUserID =
  ("/",
  async (req, res) => {
    try {
      const { stu_userID } = req.query;
      
      if (!stu_userID) {
        return res.status(400).json({ message: 'stu_userID parameter is required' });
      }
      const whereClause = {};

      if (stu_userID) {
        whereClause.stu_userID = {
          [Op.like]: `%${stu_userID}%`,
        };
      }

      const student = await Student.findAll({ where: whereClause });
      res.json(student);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error", error: error });
    }
  });

module.exports = {
  create,
  put,
  deleteStudent,
  getAll,
  getStudentByID,
  getStudentByUserID
};
