'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Instructor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Instructor.init({
    instructorName: DataTypes.STRING,
    dob: DataTypes.DATE,
    gender: DataTypes.BOOLEAN,
    academicDegree: DataTypes.STRING,
    address: DataTypes.STRING,
    moralEducation: DataTypes.STRING,
    major: DataTypes.STRING,
    phoneNum: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Instructor',
  });
  return Instructor;
};