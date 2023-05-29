const {faker} = require('@faker-js/faker/locale/vi');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const users = [];

    // Generate 50 user records with random data using faker library
    for (let i = 1; i <= 50; i++) {
      const user = {
        username: faker.internet.userName(),
        password: faker.internet.password(),
        roleid: Math.floor(Math.random() * 3) + 1,
        image: faker.image.imageUrl(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      switch(user.roleid){
        case 1 : user.accountTypeName = 'admin';
        break;
        case 2 : user.accountTypeName = 'teacher';
        break;
        default: user.accountTypeName = 'staff';
        break;
      }
      users.push(user);
    }

    return queryInterface.bulkInsert('Users', users);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
