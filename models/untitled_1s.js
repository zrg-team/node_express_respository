module.exports = function (sequelize, DataTypes) {
  const Untitled_1s = sequelize.define('untitled_1s', {
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
    tableName: 'untitled_1s',
    timestamps: false
  });
  return Untitled_1s;
}
