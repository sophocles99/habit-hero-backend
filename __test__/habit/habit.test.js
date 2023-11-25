const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const seed = require("../../db/seed");
const testData = require("../../db/data/data.test.json");

const validHabitTypes = ["positive", "negative"];
const testUser = {};

// Before each test, reseed database, log in to server and extract _id of test
// user from JWT access token.
beforeEach(async () => {
  await seed();
  testUser.email = testData[0].email;
  testUser.password = testData[0].password;
  try {
    const {
      body: { accessToken },
    } = await request(app)
      .post("/api/users/login")
      .send({ email: testUser.email, password: testUser.password });
    testUser._id = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)._id;
  } catch (error) {
    console.error(
      `Unable to log in as ${testUser.email} - testUser._id not defined`
    );
    console.error(error);
  }
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("GET /api/habit", () => {
  test("200 - returns all habits for a given user", () => {
    return request(app)
      .get("/api/habits")
      .send({ _id: testUser._id })
      .then(({ body: { habits } }) => {
        console.log(habits);
        expect(habits.length).toBe(testData[0].habits.length);
        habits.forEach(({_id, name, type, actions}) => {
          expect(mongoose.Types.ObjectId.isValid(_id)).toBe(true)
          expect(name).toEqual(expect.any(String))
          expect(validHabitTypes).toContain(type)
          expect(actions).toEqual(expect.any(Array))
        });
      });
  });
});
