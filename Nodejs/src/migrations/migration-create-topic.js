"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Topics", {
      topicID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      topicName: {
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
      members: {
        type: Sequelize.STRING,
      },
      allocationCircularID: {
        type: Sequelize.INTEGER,
      },
      councilCircularID: {
        type: Sequelize.INTEGER,
      },
      auditCircularID: {
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
    await queryInterface.dropTable("Topics");
  },
};
