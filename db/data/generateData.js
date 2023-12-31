const fs = require("fs/promises");
const { faker } = require("@faker-js/faker");
const habitNames = require("./habitNames.json");
const habitTypes = ["positive", "negative"];

// Adjust settings to create different amounts of data. The full number of
// users is generated and each user has a random number of habits, each with a
// random number of habits between minHabits and maxHabits, and a random number
// of actions up to maxActions (inclusive).
const testSettings = { users: 3, minHabits: 3, maxHabits: 5, maxActions: 30 };
const devSettings = { users: 10, minHabits: 0, maxHabits: 6, maxActions: 30 };

const testData = generateData(testSettings);
fs.writeFile(`${__dirname}/data.test.json`, JSON.stringify(testData));

const devData = generateData(devSettings);
fs.writeFile(`${__dirname}/data.development.json`, JSON.stringify(devData));

function generateData({ users, minHabits, maxHabits, maxActions }) {
  const data = [];
  for (let i = 0; i < users; i++) {
    const passwordLength = Math.floor(Math.random() * 23 + 8);
    let password = "";
    do {
      password = faker.internet.password({
        length: passwordLength,
      });
    } while (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password));
    const newUser = {
      email: faker.internet.email(),
      password: password,
      habits: [],
    };

    const numberOfHabits = Math.floor(Math.random() * (maxHabits - minHabits + 1) + minHabits);
    for (let j = 0; j < numberOfHabits; j++) {
      const newHabitType = habitTypes[Math.floor(Math.random() * 2)];
      const habitNamesOfType = habitNames[newHabitType];
      const newHabitName =
        habitNamesOfType[Math.floor(Math.random() * habitNamesOfType.length)];
      const newHabit = {
        name: newHabitName,
        type: newHabitType,
        actions: [],
      };

      const numberOfActions = Math.floor(Math.random() * maxActions + 1);
      const daysAgo = [];
      for (let k = 0; k < numberOfActions; k++) {
        let dayAgo = 0;
        while (daysAgo.includes(dayAgo)) {
          dayAgo = Math.floor(Math.random() * 31 + 1);
        }
        daysAgo.push(dayAgo);
      }
      daysAgo.sort((a, b) => b - a);

      daysAgo.forEach((dayAgo) => {
        const actionDate = new Date();
        actionDate.setHours(0, 0, 0, 0);
        actionDate.setDate(actionDate.getDate() - dayAgo);
        const newAction = {
          date: actionDate,
          isDone: Math.random() < 0.5,
        };
        newHabit.actions.push(newAction);
      });
      newUser.habits.push(newHabit);
    }
    data.push(newUser);
  }
  return data;
}
