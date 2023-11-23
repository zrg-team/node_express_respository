const { Op, col, fn } = require('sequelize')
const sequelizeOP = {
  notIn: Op.notIn,
  gt: Op.gt,
  lte: Op.lte,
  gte: Op.gte
}
const sequelizeFunctions = {
  count: (field) => fn('COUNT', col(`${field}`)),
  sum: (field) => fn('SUM', col(`${field}`))
}
const validateId = (id) => {
  if (typeof id !== 'number' || id <= 0) {
    return false;
  }
  return true;
}
const checkRecordExists = async (model, condition) => {
  const record = await model.findOne({ where: condition });
  return !!record;
}
const createRecord = async (model, data) => {
  const newRecord = await model.create(data);
  return newRecord;
}
const updateRecord = async (model, condition, data) => {
  const updatedRecord = await model.update(data, { where: condition });
  return updatedRecord;
}
const markArticleAsRead = async (userId, articleId, userArticleModel, userModel, articleModel) => {
  if (!validateId(userId) || !validateId(articleId)) {
    throw new Error('Invalid user ID or article ID');
  }
  const userExists = await checkRecordExists(userModel, { id: userId });
  const articleExists = await checkRecordExists(articleModel, { id: articleId });
  if (!userExists || !articleExists) {
    throw new Error('User or article does not exist');
  }
  const userArticleExists = await checkRecordExists(userArticleModel, { userId, articleId });
  if (userArticleExists) {
    await updateRecord(userArticleModel, { userId, articleId }, { read_at: new Date() });
  } else {
    await createRecord(userArticleModel, { userId, articleId, read_at: new Date() });
  }
  return 'Article has been marked as read by the user';
}
const calculateOffset = (page, limit) => {
  if (page < 1) page = 1;
  return (page - 1) * limit;
}
module.exports = {
  sequelizeOP,
  sequelizeFunctions,
  validateId,
  checkRecordExists,
  createRecord,
  updateRecord,
  markArticleAsRead,
  calculateOffset
}
