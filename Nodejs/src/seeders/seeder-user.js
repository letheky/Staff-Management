const casual = require('casual').en_US;
const {faker} = require('@faker-js/faker/locale/vi');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const users = [];

    // Generate 50 user records with random data using faker library
    for (let i = 1; i <= 5; i++) {
      const user = {
        username: casual.username,
        // password: casual.password,
        // roleid: Math.floor(Math.random() * 3) + 1,
        // image: 'asdasdas',
        // createdAt: new Date(),
        // updatedAt: new Date()
        // username: faker.internet.userName(),
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
        default: user.accountTypeName = 'student';
        break;
      }

      users.push(user);

      // if(users[i].accountTypeName === 'admin')
    }
    // const users =[{
    //   username:'aaa',
    //   password:'123456',
    //   roleid: Math.floor(Math.random() * 3) + 1,
    //   image: 'aaa',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // }]

    return queryInterface.bulkInsert('Users', users);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
