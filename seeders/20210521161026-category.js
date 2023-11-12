module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('categories', [{
      name: 'Technology',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('categories', { id: { [Sequelize.Op.in]: [1] } }, {})
  }
}
