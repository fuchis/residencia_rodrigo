'use strict';
const { Model } = require('sequelize');
const db = require('./index');


module.exports = (sequelize, DataTypes) => {
  class Prestamos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Usuarios, {foreignKey: 'Id_Usuario'})
      this.belongsTo(models.Equipos, {foreignKey: 'Id_Equipo'});
    }
  };
  Prestamos.init({
    Id_Prestamo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Id_Usuario: DataTypes.INTEGER,
    Id_Equipo: DataTypes.INTEGER,
    Fecha: DataTypes.DATE,
    Estado: DataTypes.STRING,
    fk_horarios: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Prestamos',
    timestamps: false
  });
  return Prestamos;
};