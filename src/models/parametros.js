'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Parametros extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  };
  Parametros.init({
    Id_Parametros: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Email: DataTypes.STRING,
    Password: DataTypes.STRING,
    Notificar: DataTypes.STRING,
    Telefono: DataTypes.STRING,

  }, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'Parametros',
  });
  return Parametros;
};