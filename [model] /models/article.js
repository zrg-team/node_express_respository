/* jshint indent: 2 */
module.exports = function (sequelize, DataTypes) {
  const Article = sequelize.define('Article', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'users', // This is the table name, not the model name
        key: 'id'
      }
    }
  }, {
    tableName: 'articles',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  Article.associate = function(models) {
    // Ensure the association is correctly defined
    Article.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'author'
    });
  };
  return Article;
};
