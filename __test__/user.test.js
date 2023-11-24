const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seed");

beforeEach(async () => await seed());

afterAll(async () => await mongoose.connection.close());

describe("POST /api/user/register", () => {
  test("201 - registers new user and returns message", () => {
    const newUser = {
      email: "newuser@email.com",
      password: "Password123",
    };
    return request(app)
      .post("/api/user/register")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("New user registered");
      });
  });
  test("201 - returns JWT accessToken containing id of new user", () => {
    const newUser = {
      email: "newuser@email.com",
      password: "Password123",
    };
    return request(app)
      .post("/api/user/register")
      .send(newUser)
      .expect(201)
      .then(({ body }) => {
        expect(body).toHaveProperty("accessToken");
        const { accessToken } = body;
        const decodedToken = jwt.verify(accessToken, "testAccessTokenSecret");
        expect(decodedToken).toHaveProperty("_id");
      });
  });
});
