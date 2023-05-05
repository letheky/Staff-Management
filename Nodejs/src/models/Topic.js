'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Topic extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
    }
  };
  Topic.init({
    topicName: DataTypes.STRING,
    duration: DataTypes.STRING,
    leaderID: DataTypes.INTEGER,
    leaderName: DataTypes.STRING,
    members: DataTypes.TEXT,
    progress: DataTypes.STRING,
    allocationCircularID: DataTypes.INTEGER,
    councilCircularID: DataTypes.INTEGER,
    auditCircularID: DataTypes.INTEGER,
    councilMembers: DataTypes.TEXT,
  }, {
    sequelize,
    modelName: 'Topic',
  });
  return Topic;
};