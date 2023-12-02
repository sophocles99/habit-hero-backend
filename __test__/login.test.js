const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../app");
const seed = require("../db/seed");
const testData = require("../db/data/data.test.json");

beforeEach(async () => await seed());

afterAll(async () => await mongoose.connection.close());

describe.only("POST /api/users/login", () => {
  test("200 - logs user in and returns message", () => {
    const user = {
      email: testData[0].email,
      password: testData[0].password,
    };
    return request(app)
      .post("/api/users/login")
      .send(user)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("message");
        expect(body.message).toBe("User logged in");
      });
  });
  test("200 - returns JWT accessToken containing id of logged-in user", () => {
    const user = {
      email: testData[0].email,
      password: testData[0].password,
    };
    return request(app)
      .post("/api/users/login")
      .send(user)
      .expect(200)
      .then(({ body }) => {
        expect(body).toHaveProperty("accessToken");
        // Strictly speaking the rest of this test tests the generateTokens
        // method, not the server
        const { accessToken } = body;
        const decodedToken = jwt.verify(accessToken, "testAccessTokenSecret");
        expect(decodedToken).toHaveProperty("_id");
        const { _id } = decodedToken;
        expect(mongoose.Types.ObjectId.isValid(_id)).toBe(true);
      });
  });
  test("200 - returns cookie containing JWT refreshToken containing id of logged-in user", () => {
    const user = {
      email: testData[0].email,
      password: testData[0].password,
    };
    return request(app)
      .post("/api/users/login")
      .send(user)
      .expect(200)
      .then((response) => {
        const cookies = response.headers["set-cookie"].map(cookie.parse);
        const refreshTokenCookie = cookies.find((cookie) =>
          Object.hasOwn(cookie, "jwt")
        );
        const refreshToken = refreshTokenCookie.jwt;
        const decodedToken = jwt.verify(refreshToken, "testRefreshTokenSecret");
        expect(decodedToken).toHaveProperty("_id");
        const { _id } = decodedToken;
        expect(mongoose.Types.ObjectId.isValid(_id)).toBe(true);
      });
  });
});
