const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../../app");
const seed = require("../../db/seed");
const testData = require("../../db/data/data.test.json");

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
        // Strictly speaking the rest of this test tests the generateTokens
        // method, not the server
        const { accessToken } = body;
        const decodedToken = jwt.verify(accessToken, "testAccessTokenSecret");
        expect(decodedToken).toHaveProperty("_id");
        const { _id } = decodedToken;
        expect(mongoose.Types.ObjectId.isValid(_id)).toBe(true);
      });
  });
  test("409 - returns error if email already exists", () => {
    const newUser = {
      email: testData[0].email,
      password: testData[0].password,
    };
    return request(app)
      .post("/api/user/register")
      .send(newUser)
      .expect(409)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
        expect(body.error).toBe("Email address is already registered");
      });
  });
  test("400 - returns error if email is not provided", () => {
    const newUser = {
      password: "Password123",
    };
    return request(app)
      .post("/api/user/register")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
        expect(body.error).toBe("Email is required");
      });
  });
  test("400 - returns error if email is empty", () => {
    const newUser = {
      email: "",
      password: "Password123",
    };
    return request(app)
      .post("/api/user/register")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
        expect(body.error).toBe("Email is required");
      });
  });
  test("400 - returns error if email is invalid", () => {
    const newUser = {
      email: "notAnEmailAddress",
      password: "Password123",
    };
    return request(app)
      .post("/api/user/register")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
        expect(body.error).toBe("Email must be a valid email address");
      });
  });
  test("400 - returns error if password is not provided", () => {
    const newUser = {
      email: "newuser@email.com",
    };
    return request(app)
      .post("/api/user/register")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
        expect(body.error).toBe("Password is required");
      });
  });
  test("400 - returns error if password is empty", () => {
    const newUser = {
      email: "newuser@email.com",
      password: "",
    };
    return request(app)
      .post("/api/user/register")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
        expect(body.error).toBe("Password is required");
      });
  });
  test("400 - returns error if password contains fewer than 8 characters", () => {
    const newUser = {
      email: "newuser@email.com",
      password: "Pwor123",
    };
    return request(app)
      .post("/api/user/register")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
        expect(body.error).toBe("Password must be at least 8 characters long");
      });
  });
  test("400 - returns error if password contains more than 30 characters", () => {
    const newUser = {
      email: "newuser@email.com",
      password: "MyVeryLongPassword1234567890*&^",
    };
    return request(app)
      .post("/api/user/register")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
        expect(body.error).toBe(
          "Password must not be more than 30 characters long"
        );
      });
  });
  test("400 - returns error if password does not contain a lowercase letter", () => {
    const newUser = {
      email: "newuser@email.com",
      password: "PASSWORD123",
    };
    return request(app)
      .post("/api/user/register")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
        expect(body.error).toBe(
          "Password must include at least one lowercase letter"
        );
      });
  });
  test("400 - returns error if password does not contain an uppercase letter", () => {
    const newUser = {
      email: "newuser@email.com",
      password: "password123",
    };
    return request(app)
      .post("/api/user/register")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
        expect(body.error).toBe(
          "Password must include at least one uppercase letter"
        );
      });
  });
  test("400 - returns error if password does not contain a digit", () => {
    const newUser = {
      email: "newuser@email.com",
      password: "Password",
    };
    return request(app)
      .post("/api/user/register")
      .send(newUser)
      .expect(400)
      .then(({ body }) => {
        expect(body).toHaveProperty("error");
        expect(body.error).toBe("Password must include at least one digit");
      });
  });
});
