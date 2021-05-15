'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Equipos extends Model {
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
  Equipos.init({
    Id_Equipo: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    Nombre: DataTypes.STRING,
    Codigo_Serie: DataTypes.STRING,
    Modelo: DataTypes.STRING,
    Categoria: DataTypes.STRING,
    Marca: DataTypes.STRING,
    Descripcion: DataTypes.TEXT,
    Estado: DataTypes.INTEGER,
    Estado_Fisico_Equipo: DataTypes.INTEGER,
    Tiempo_Original: DataTypes.STRING,
    Tiempo_Restante: DataTypes.STRING,
    Tiempo_Restante_Porcentaje: DataTypes.DECIMAL,
  }, {
    sequelize,
    timestamps: false,
    modelName: 'Equipos',
  });
  return Equipos;
};