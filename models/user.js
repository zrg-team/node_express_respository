module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar_file_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'users'
  });
  User.associate = (factory) => {
    factory.User.hasMany(factory.Article, {
      as: 'articles',
      foreignKey: 'user_id',
      sourceKey: 'id'
    });
    factory.User.associationModels = {
      articles: factory.Article
    };
  };
  return User;
};
