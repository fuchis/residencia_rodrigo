'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Bitacora extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {

    }
  };
  Bitacora.init({
    Id_Bitacora: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Id_Usuario: DataTypes.INTEGER,
    Usuario: DataTypes.STRING,
    Nombre_Usuario: DataTypes.STRING,
    Descripcion: DataTypes.TEXT,
    Fecha: DataTypes.TEXT ,
    Tipo: DataTypes.INTEGER
  }, {
    sequelize,
    timestamps: false,
    freezeTableName: true,
    modelName: 'Bitacora',
  });
  return Bitacora;
};