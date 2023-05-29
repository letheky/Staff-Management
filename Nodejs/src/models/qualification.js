'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Qualification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Qualification.belongsTo(models.Employee, { foreignKey: 'employeeID' });
    }
  };
  Qualification.init({
    qualificationID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    employeeID: DataTypes.INTEGER,
    degree: DataTypes.STRING,
    field: DataTypes.STRING,
    institution: DataTypes.STRING,
    yearCompleted: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Qualification',
  });
  return Qualification;
};