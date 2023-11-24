module.exports = function (sequelize, DataTypes) {
  const Generatings = sequelize.define('generatings', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'generatings',
    timestamps: false
  });
  return Generatings;
}
