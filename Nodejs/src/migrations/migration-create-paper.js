"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Papers", {
      paperID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      paperTitle: {
        type: Sequelize.STRING,
      },
      paperContent: {
        type: Sequelize.STRING,
      },
      paperType: {
        type: Sequelize.STRING,
      },
      publicDate: {
        type: Sequelize.DATE,
      },
      authors: {
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
    await queryInterface.dropTable("Papers");
  },
};
