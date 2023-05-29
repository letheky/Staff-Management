'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Promotion', {
      promotionID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employeeID: {
        type: Sequelize.INTEGER
      },
      achievement: {
        type: Sequelize.STRING
      },
      degree: {
        type: Sequelize.TEXT
      },
      actualDate: {
        type: Sequelize.DATE
      },
      realDate: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Promotion');
  }
};