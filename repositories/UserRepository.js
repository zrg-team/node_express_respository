const BaseRepository = require('./BaseRepository')
const { User } = require('../models')
const { Op } = require('sequelize')
const bcrypt = require('bcrypt')
class UserRepository extends BaseRepository {
  constructor () {
    super('user')
    this.DEFAULT_LIMIT = 10
    this.DEFAULT_SORT = [['created_at', 'DESC']]
    this.DEFAULT_PAGE = 0
  }
  async findByEmail(email) {
    try {
      const user = await User.findOne({
        where: { email }
      })
      return user
    } catch (error) {
      throw error
    }
  }
  async createUser(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const user = await User.create({
        ...userData,
        password: hashedPassword
      })
      return user
    } catch (error) {
      throw error
    }
  }
  async confirmEmail(userId) {
    try {
      const user = await User.update({ email_confirmed: true }, {
        where: { id: userId }
      })
      return user
    } catch (error) {
      throw error
    }
  }
  async updateUser(userId, userData) {
    try {
      const existingUser = await User.findOne({
        where: { id: userId }
      })
      if (!existingUser) {
        throw new Error('User not found')
      }
      const emailExists = await User.findOne({
        where: { 
          email: userData.email,
          id: {
            [Op.ne]: userId
          }
        }
      })
      if (emailExists) {
        throw new Error('Email already exists')
      }
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const user = await User.update({
        name: userData.name,
        email: userData.email,
        password: hashedPassword
      }, {
        where: { id: userId }
      })
      return user
    } catch (error) {
      throw error
    }
  }
}
module.exports = new UserRepository()
