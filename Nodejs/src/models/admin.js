'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Admin extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Admin.belongsTo(models.User, { foreignKey: 'admin_userID' });
    }
  };
  Admin.init({
    
    adminID: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    admin_userID: DataTypes.INTEGER,
    adminName: DataTypes.STRING,
    dob: DataTypes.DATE,
    gender: DataTypes.BOOLEAN,
    address: DataTypes.STRING,
    phoneNum: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Admin',
  });
  return Admin;
};