module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('articles', [{
      title: 'Article 1',
      content: 'Content for article 1',
      publication_date: new Date()
    }, {
      title: 'Article 2',
      content: 'Content for article 2',
      publication_date: new Date()
    }, {
      title: 'Article 3',
      content: 'Content for article 3',
      publication_date: new Date()
    }], {})
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('articles', {
      id: {
        [Sequelize.Op.in]: [1, 2, 3]
      }
    }, {})
  }
}
