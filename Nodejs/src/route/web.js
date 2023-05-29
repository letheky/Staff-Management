import express from "express";
import homeController from "../controller/homeController";
import userController from "../controller/userController";
import departmentController from "../controller/departmentController";
import contractController from "../controller/contractController";
import employeeController from "../controller/employeeController";
import leaveRequestController from "../controller/leaveRequestController";
import planController from "../controller/planController";
import promotionController from "../controller/promotionController";
import qualificationController from "../controller/qualificationController";
import staffController from "../controller/staffController";
import teacherController from "../controller/teacherController";
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
  
  //department
  router.post("/api/department/create", authToken.verifyUserToken ,departmentController.create);
  router.put("/api/department/edit", authToken.verifyUserToken, departmentController.put);
  router.delete("/api/department/delete", authToken.verifyUserToken, departmentController.deleteDepartment);
  router.get("/api/department/getAll", authToken.verifyUserToken, departmentController.getAll);
  router.get("/api/department/getDepartment", authToken.verifyUserToken, departmentController.getDepartmentByID);

  //employee
  router.post("/api/employee/create", authToken.verifyUserToken ,employeeController.create);
  router.put("/api/employee/edit", authToken.verifyUserToken, employeeController.put);
  router.delete("/api/employee/delete", authToken.verifyUserToken, employeeController.deleteEmployee);
  router.get("/api/employee/getAll", authToken.verifyUserToken, employeeController.getAll);
  router.get("/api/employee/getEmployee", authToken.verifyUserToken, employeeController.getEmployeeByID);
  router.get("/api/employee/getActiveEmployee", authToken.verifyUserToken, employeeController.getAllActive);
  router.put("/api/employee/deActive", authToken.verifyUserToken, employeeController.deActive);

  //contract
  router.post("/api/contract/create", authToken.verifyUserToken ,contractController.create);
  router.put("/api/contract/edit", authToken.verifyUserToken, contractController.put);
  router.delete("/api/contract/delete", authToken.verifyUserToken, contractController.deleteContract);
  router.get("/api/contract/getAll", authToken.verifyUserToken, contractController.getAll);
  router.get("/api/contract/getContract", authToken.verifyUserToken, contractController.getContractByID);

  //staff
  router.post("/api/staff/create", authToken.verifyUserToken ,staffController.create);
  router.put("/api/staff/edit", authToken.verifyUserToken, staffController.put);
  router.delete("/api/staff/delete", authToken.verifyUserToken, staffController.deleteStaff);
  router.get("/api/staff/getAll", authToken.verifyUserToken, staffController.getAll);
  router.get("/api/staff/getStaff", authToken.verifyUserToken, staffController.getStaffByID);

  //plan
  router.post("/api/plan/create", authToken.verifyUserToken ,planController.create);
  router.put("/api/plan/edit", authToken.verifyUserToken, planController.put);
  router.delete("/api/plan/delete", authToken.verifyUserToken, planController.deletePlan);
  router.get("/api/plan/getAll", authToken.verifyUserToken, planController.getAll);
  router.get("/api/plan/getPlan", authToken.verifyUserToken, planController.getPlanByID);

  //qualification
  router.post("/api/qualification/create", authToken.verifyUserToken ,qualificationController.create);
  router.put("/api/qualification/edit", authToken.verifyUserToken, qualificationController.put);
  router.delete("/api/qualification/delete", authToken.verifyUserToken, qualificationController.deleteQualification);
  router.get("/api/qualification/getAll", authToken.verifyUserToken, qualificationController.getAll);
  router.get("/api/qualification/getQualification", authToken.verifyUserToken, qualificationController.getQualificationByID);

  //leaveRequest
  router.post("/api/leaveRequest/create", authToken.verifyUserToken ,leaveRequestController.create);
  router.put("/api/leaveRequest/edit", authToken.verifyUserToken, leaveRequestController.put);
  router.delete("/api/leaveRequest/delete", authToken.verifyUserToken, leaveRequestController.deleteLeaveRequest);
  router.get("/api/leaveRequest/getAll", authToken.verifyUserToken, leaveRequestController.getAll);
  router.get("/api/leaveRequest/getLeaveRequest", authToken.verifyUserToken, leaveRequestController.getLeaveRequestByID);

  // promotion
  router.post("/api/promotion/create", authToken.verifyUserToken ,promotionController.create);
  router.put("/api/promotion/edit", authToken.verifyUserToken, promotionController.put);
  router.delete("/api/promotion/delete", authToken.verifyUserToken, promotionController.deletePromotion);
  router.get("/api/promotion/getAll", authToken.verifyUserToken, promotionController.getAll);
  router.get("/api/promotion/getPromotion", authToken.verifyUserToken, promotionController.getPromotionByID);

  // teacher
  router.post("/api/teacher/create", authToken.verifyUserToken ,teacherController.create);
  router.put("/api/teacher/edit", authToken.verifyUserToken, teacherController.put);
  router.delete("/api/teacher/delete", authToken.verifyUserToken, teacherController.deleteTeacher);
  router.get("/api/teacher/getAll", authToken.verifyUserToken, teacherController.getAll);
  router.get("/api/teacher/getTeacher", authToken.verifyUserToken, teacherController.getTeacherByID);

  

  return app.use("/", router);
};

module.exports = initWebRoutes;
