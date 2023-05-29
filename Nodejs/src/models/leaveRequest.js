'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class LeaveRequest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      LeaveRequest.belongsTo(models.Employee, { foreignKey: 'employeeID' });
    }
  };
  LeaveRequest.init({
    leaveRequestID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    employeeID: DataTypes.INTEGER,
    requestDate: DataTypes.DATE,
    leaveType:DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
  }, {
    sequelize,
    modelName: 'LeaveRequest',
  });
  return LeaveRequest;
};