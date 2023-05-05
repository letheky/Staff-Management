"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Seminars", {
      semianrID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      seminarName: {
        type: Sequelize.STRING,
      },
      seminarPlan: {
        type: Sequelize.STRING,
      },
      peopleAssignNum: {
        type: Sequelize.INTEGER,
      },
      paperAssign: {
        type: Sequelize.TEXT,
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
    await queryInterface.dropTable("Seminars");
  },
};
