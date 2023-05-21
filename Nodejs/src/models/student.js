'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Student.belongsTo(models.User, { foreignKey: 'stu_userID' });
    }
  };
  Student.init({
    studentID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    stu_userID: DataTypes.INTEGER,
    studentName: DataTypes.STRING,
    dob: DataTypes.DATE,
    gender: DataTypes.BOOLEAN,
    academicDegree: DataTypes.STRING,
    address: DataTypes.STRING,
    classCode: DataTypes.STRING,
    major: DataTypes.STRING,
    phoneNum: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Student',
  });
  return Student;
};