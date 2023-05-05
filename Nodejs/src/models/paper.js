'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Paper extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Paper.init({
    paperTitle: DataTypes.STRING,
    paperContent: DataTypes.STRING,
    paperType: DataTypes.STRING,
    publicDate: DataTypes.DATE,
    authors: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Paper',
  });
  return Paper;
};