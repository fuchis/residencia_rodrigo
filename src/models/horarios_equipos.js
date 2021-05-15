'use strict';
const { Model } = require('sequelize');
const db = require('./index');


module.exports = (sequelize, DataTypes) => {
  class Horarios_Equipos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
   
    }
  };
  Horarios_Equipos.init({
    Id_Horario_Equipos: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Fk_Id_Horario: DataTypes.INTEGER,
    Fk_Id_Equipo: DataTypes.INTEGER,
    Estado: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Horarios_Equipos',
    timestamps: false
  });
  return Horarios_Equipos;
};