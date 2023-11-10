const { Op, col, fn, Model, Sequelize } = require('sequelize')
const bcrypt = require('bcrypt');
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
const updateUser = async (userId, updatedData) => {
  const model = Model.getModel('users');
  // Check if user exists
  const user = await model.findOne({ where: { id: userId } });
  if (!user) {
    throw new Error('User not found');
  }
  // Check if email is already registered
  const existingEmailUser = await model.findOne({ where: { email: updatedData.email } });
  if (existingEmailUser && existingEmailUser.id !== userId) {
    throw new Error('Email is already registered');
  }
  // Encrypt password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(updatedData.password, salt);
  updatedData.password = hashedPassword;
  updatedData.updated_at = Sequelize.literal('CURRENT_TIMESTAMP');
  await model.update(updatedData, {
    where: {
      id: userId
    }
  });
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}
module.exports = {
  sequelizeOP,
  sequelizeFunctions,
  updateUser
}
