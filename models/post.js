const hooks = {
  beforeCreate: (post) => {
    // Add any logic you want to execute before creating a post
  },
  beforeUpdate: (post) => {
    // Add any logic you want to execute before updating a post
  },
  beforeBulkUpdate: (data) => {
    // Add any logic you want to execute before bulk updating posts
  }
}
module.exports = function (sequelize, DataTypes) {
  const Post = sequelize.define('post', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(256),
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      defaultValue: '1'
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'created_at'
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'updated_at'
    },
    authorId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      field: 'author_id'
    },
    // Add any other fields you need for the posts table
  }, {
    hooks,
    tableName: 'posts'
  });
  Post.associate = (factory) => {
    factory.Post.belongsTo(factory.User, {
      as: 'author',
      foreignKey: 'author_id',
      sourceKey: 'id'
    });
    // Define other associations like hasMany, belongsToMany if needed
  }
  return Post;
}
