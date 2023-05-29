'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promotion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Promotion.belongsTo(models.Employee, { foreignKey: 'employeeID' });
    }
  };
  Promotion.init({
    promotionID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    employeeID: DataTypes.INTEGER,
    achievement: DataTypes.STRING,
    degree: DataTypes.TEXT,
    actualDate: DataTypes.DATE,
    realDate: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'Promotion',
  });
  return Promotion;
};