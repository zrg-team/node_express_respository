module.exports = function (sequelize, DataTypes) {
  const Post = sequelize.define('post', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    title: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'post'
  })
  Post.associate = (factory) => {
    factory.Post.belongsTo(factory.User, {
      as: 'userOfPost',
      foreignKey: 'user_id',
      sourceKey: 'id'
    })

    factory.Post.associationModels = {
      userOfPost: factory.User
    }
  }

  return Post
}
