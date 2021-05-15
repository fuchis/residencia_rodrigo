'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Usuarios extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Prestamos);
    }
  };

  Usuarios.init({
    Id_Usuario: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Nombre_Usuario: DataTypes.STRING,
    Nombre: DataTypes.STRING,
    Apellido: DataTypes.STRING,
    Tipo: DataTypes.INTEGER,
    Pass: DataTypes.STRING,
    Estado: DataTypes.INTEGER,
    Telefono: DataTypes.STRING
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Usuarios',
  });
  return Usuarios;
};