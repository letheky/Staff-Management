'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Circular extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Circular.init({
    
    circularID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    circularType: DataTypes.STRING,
    circularName: DataTypes.STRING,
    circularImage: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Circular',
  });
  return Circular;
};