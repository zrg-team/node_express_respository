module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('users', {
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
    },
    user_type_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_type',
        key: 'id'
      }
    }
  }, {
    tableName: 'users',
    timestamps: false
  });
  User.associate = function(models) {
    User.hasMany(models.Article, {
      foreignKey: 'user_id',
      as: 'articles'
    });
    User.belongsTo(models.UserType, {
      foreignKey: 'user_type_id',
      as: 'userType'
    });
  };
  return User;
};
