'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Research extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Research.init({
    researchTitle: DataTypes.STRING,
    description: DataTypes.TEXT,
    usage: DataTypes.STRING,
    duration: DataTypes.STRING,
    leaderID: DataTypes.INTEGER,
    leaderName: DataTypes.STRING,
    members: DataTypes.TEXT,
    allocationCircularID: DataTypes.INTEGER,
    councilCircularID: DataTypes.INTEGER,
    councilMembers: DataTypes.TEXT
    
  }, {
    sequelize,
    modelName: 'Research',
  });
  return Research;
};