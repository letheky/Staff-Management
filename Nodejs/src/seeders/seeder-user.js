const faker = require('faker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const users = [];

    // Generate 50 user records with random data using faker library
    for (let i = 1; i <= 50; i++) {
      users.push({
        username: faker.internet.userName(),
        password: faker.internet.password(),
        roleid: Math.floor(Math.random() * 3) + 1,
        image: faker.image.imageUrl(),
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    return queryInterface.bulkInsert('User', users);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('User', null, {});
  }
};
