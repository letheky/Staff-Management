"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Research", {
      researchID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      researchTitle: {
        type: Sequelize.STRING,
      },
      description: {
        type: Sequelize.TEXT,
      },
      usage: {
        type: Sequelize.STRING,
      },
      duration: {
        type: Sequelize.STRING,
      },
      leaderID: {
        type: Sequelize.INTEGER,
      },
      leaderName: {
        type: Sequelize.STRING,
      },
      members: {
        type: Sequelize.TEXT,
      },
      allocationCircularID: {
        type: Sequelize.INTEGER,
      },
      councilCircularID: {
        type: Sequelize.INTEGER,
      },
      councilMembers: {
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
    await queryInterface.dropTable("Research");
  },
};
