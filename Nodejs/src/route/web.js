import express from "express";
import homeController from "../controller/homeController";
import userController from "../controller/userController";
import studentController from "../controller/studentController";
import instructorController from "../controller/instructorController";
import adminController from "../controller/adminController";
import researchController from "../controller/researchController";
import topicController from "../controller/topicController";
import seminarController from "../controller/seminarController";
import paperController from "../controller/paperController";
import circularController from "../controller/circularController";
import authToken from '../middleware/authToken';
const cors = require('cors');
const upload = require('../middleware/multer');

let router = express.Router();

let initWebRoutes = (app) => {

  app.use(cors());

  //upload file
  router.post("/api/uploadFile", authToken.verifyUserToken, upload.single('file'), homeController.uploadImage);

  //user
  router.post("/api/register", upload.single('image'), userController.register);
  router.post("/api/login", userController.login);
  router.post("/api/changepassword", authToken.verifyUserToken, userController.changePassword);
  router.get("/api/getAllUser", authToken.verifyUserToken, userController.getAll);
  router.delete("/api/user/delete", authToken.verifyUserToken, userController.deleteUser);
  
  //student
  router.post("/api/student/create", authToken.verifyUserToken ,studentController.create);
  router.put("/api/student/edit", authToken.verifyUserToken, studentController.put);
  router.delete("/api/student/delete", authToken.verifyUserToken, studentController.deleteStudent);
  router.get("/api/student/getAll", authToken.verifyUserToken, studentController.getAll);
  router.get("/api/student/getStudent", authToken.verifyUserToken, studentController.getStudentByID);
  router.get("/api/student/getStudentByUserID", authToken.verifyUserToken, studentController.getStudentByUserID);

  //admin
  router.post("/api/admin/create", authToken.verifyUserToken ,adminController.create);
  router.put("/api/admin/edit", authToken.verifyUserToken, adminController.put);
  router.delete("/api/admin/delete", authToken.verifyUserToken, adminController.deleteAdmin);
  router.get("/api/admin/getAll", authToken.verifyUserToken, adminController.getAll);
  router.get("/api/admin/getAdmin", authToken.verifyUserToken, adminController.getAdminByID);
  router.get("/api/admin/getAdminByUserID", authToken.verifyUserToken, adminController.getAdminByUserID);

  //instructor
  router.post("/api/instructor/create", authToken.verifyUserToken ,instructorController.create);
  router.put("/api/instructor/edit", authToken.verifyUserToken, instructorController.put);
  router.delete("/api/instructor/delete", authToken.verifyUserToken, instructorController.deleteInstructor);
  router.get("/api/instructor/getAll", authToken.verifyUserToken, instructorController.getAll);
  router.get("/api/instructor/getInstructor", authToken.verifyUserToken, instructorController.getInstructorByID);
    router.get("/api/instructor/getInstructorByUserID", authToken.verifyUserToken, instructorController.getInstructorByUserID);

  //circular
  router.post("/api/circular/create", authToken.verifyUserToken ,circularController.create);
  router.put("/api/circular/edit", authToken.verifyUserToken, circularController.put);
  router.delete("/api/circular/delete", authToken.verifyUserToken, circularController.deleteCircular);
  router.get("/api/circular/getAll", authToken.verifyUserToken, circularController.getAll);
  router.get("/api/circular/getCircular", authToken.verifyUserToken, circularController.getCircularByID);

  //topic
  router.post("/api/topic/create", authToken.verifyUserToken ,topicController.create);
  router.put("/api/topic/edit", authToken.verifyUserToken, topicController.put);
  router.delete("/api/topic/delete", authToken.verifyUserToken, topicController.deleteTopic);
  router.get("/api/topic/getAll", authToken.verifyUserToken, topicController.getAll);
  router.get("/api/topic/getStudentInResearch", authToken.verifyUserToken, topicController.getStudentInResearch);
  router.get("/api/topic/getTopic", authToken.verifyUserToken, topicController.getTopicByID);

  //paper
  router.post("/api/paper/create", authToken.verifyUserToken ,paperController.create);
  router.put("/api/paper/edit", authToken.verifyUserToken, paperController.put);
  router.delete("/api/paper/delete", authToken.verifyUserToken, paperController.deletePaper);
  router.get("/api/paper/getAll", authToken.verifyUserToken, paperController.getAll);
  router.get("/api/paper/getPaper", authToken.verifyUserToken, paperController.getPaperByID);

  //research
  router.post("/api/research/create", authToken.verifyUserToken ,researchController.create);
  router.put("/api/research/edit", authToken.verifyUserToken, researchController.put);
  router.delete("/api/research/delete", authToken.verifyUserToken, researchController.deleteResearch);
  router.get("/api/research/getAll", authToken.verifyUserToken, researchController.getAll);
  router.get("/api/research/getInstructorInResearch", authToken.verifyUserToken, researchController.getInstructorInResearch);
  router.get("/api/research/getResearch", authToken.verifyUserToken, researchController.getResearchByID);

  // seminar
  router.post("/api/seminar/create", authToken.verifyUserToken ,seminarController.create);
  router.put("/api/seminar/edit", authToken.verifyUserToken, seminarController.put);
  router.delete("/api/seminar/delete", authToken.verifyUserToken, seminarController.deleteSeminar);
  router.get("/api/seminar/getAll", authToken.verifyUserToken, seminarController.getAll);
  router.get("/api/seminar/getSeminar", authToken.verifyUserToken, seminarController.getSeminarByID);

  

  return app.use("/", router);
};

module.exports = initWebRoutes;
