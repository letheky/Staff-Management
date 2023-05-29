"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Employees", {
      employeeID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      employeeName: {
        type: Sequelize.STRING,
      },
      dob: {
        type: Sequelize.DATE,
      },
      gender: {
        type: Sequelize.BOOLEAN,
      },
      address: {
        type: Sequelize.STRING,
      },
      phoneNum: {
        type: Sequelize.STRING,
      },
      email: {
        type: Sequelize.STRING,
      },
      joiningDate: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      salary: {
        type: Sequelize.STRING,
      },
      insuranceContribution: {
        type: Sequelize.INTEGER,
      },
      isHighLevelTeacher: {
        type: Sequelize.BOOLEAN,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Employees");
  },
};
