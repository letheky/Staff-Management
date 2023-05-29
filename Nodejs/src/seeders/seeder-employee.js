const { faker } = require("@faker-js/faker/locale/vi");
const _ = require('lodash');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const users = [];
    // Generate 50 user records with random data using faker library
    for (let i = 1; i <= 240; i++) {
      const user = {
        employeeName: faker.name.fullName(),
        dob: faker.date.past(),
        gender: faker.datatype.boolean(),
        address: faker.address.streetAddress(),
        phoneNum: faker.phone.number('081-###-####'),
        email: faker.internet.email(),
        joiningDate: faker.date.past(),
        type: _.sample(["Viên chức", "Hợp đồng"]),
        salary: faker.datatype.number({ min: 2000, max: 5000 }).toString(),
        insuranceContribution: faker.datatype.number({ min: 0, max: 30 }),
        isHighLevelTeacher: faker.datatype.boolean(),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      users.push(user);
    }

    return queryInterface.bulkInsert("Employees", users);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete("Employees", null, {});
  },
};
