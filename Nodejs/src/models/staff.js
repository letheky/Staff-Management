'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Staff.belongsTo(models.Employee, { foreignKey: 'employeeID' });
    }
  };
  Staff.init({
    staffID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    employeeID: DataTypes.INTEGER,
    role: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Staff',
  });
  return Staff;
};