'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
    }
  };
  Employee.init({
    employeeID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    employeeName: DataTypes.STRING,
    dob: DataTypes.DATE,
    gender: DataTypes.BOOLEAN,
    address: DataTypes.STRING,
    phoneNum: DataTypes.STRING,
    email: DataTypes.STRING,
    joiningDate: DataTypes.STRING,
    type: DataTypes.STRING,
    salary: DataTypes.STRING,
    insuranceContribution: DataTypes.INTEGER,
    isHighLevelTeacher: DataTypes.BOOLEAN,
    isActive: DataTypes.BOOLEAN,
  }, {
    sequelize,
    modelName: 'Employee',
  });
  return Employee;
};