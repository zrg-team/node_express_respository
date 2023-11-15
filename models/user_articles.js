/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('user_articles', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    read_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    article_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'articles',
        key: 'id'
      }
    }
  }, {
    tableName: 'user_articles',
    timestamps: false
  })
}
