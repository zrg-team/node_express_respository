'use strict';
module.exports = (sequelize, DataTypes) => {
  const Tag = sequelize.define('Tag', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    created_at: DataTypes.DATE,
    updated_at: DataTypes.DATE,
    name: DataTypes.STRING
  }, {});
  Tag.associate = function(models) {
    // associations can be defined here
    Tag.hasMany(models.ArticleTag, { foreignKey: 'tag_id' });
  };
  return Tag;
};
