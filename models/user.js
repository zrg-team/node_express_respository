module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    confirmationStatus: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    createdat: {
      type: DataTypes.DATE,
      allowNull: false
    },
    updatedat: {
      type: DataTypes.DATE,
      allowNull: false
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avatar_file_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shop_name: {
      type: DataTypes.STRING,
      allowNull: true
    },
    shop_address: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'users',
    timestamps: false
  });
  User.associate = (models) => {
    User.hasMany(models.Article, {
      foreignKey: 'user_id',
      as: 'articles'
    });
    User.hasMany(models.UserArticles, {
      foreignKey: 'user_id',
      as: 'user_articles'
    });
  }
  return User;
}
