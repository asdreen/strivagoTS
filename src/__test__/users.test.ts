import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { expressServer } from "../server";

dotenv.config();

interface LoginResponse {
  accessToken: string;
}

const client = supertest(expressServer);

const validUser = {
  email: "asdren.jerliu@gmail.com",
  password: "12345",
  role: "Guest",
};

const validGuestLogin = {
  email: "asdren.jerliu@gmail.com",
  password: "12345",
};

const validUserHost = {
  email: "asdren.jerliu@gmail.com",
  password: "12345",
  role: "Host",
};

const validHostLogin = {
  email: "asdren.jerliu@gmail.com",
  password: "12345",
};

const notValidUSer = {
  email: "john@gmail.com",
  password: "badpass",
  role: "notValidValue",
};

describe("Test APIs", () => {
  let hostTokens: LoginResponse;
  let guestTokens: LoginResponse;

  beforeAll(async () => {
    if (process.env.MONGO_URL) {
      await mongoose.connect(process.env.MONGO_URL);
    }
  });

  //   Mongo check

  it("Should check that Mongo connection string is not undefined", () => {
    expect(process.env.MONGO_URL).toBeDefined();
  });

  //   GET users

  it("Should return 200 when GET /users is successful", async () => {
    const response = await client.get("/users");
    expect(response.status).toBe(200);
  });

  //   REGISTER users

  it("Should return 201 when POST /users/register with a Guest is successful", async () => {
    const response = await client.post("/users/register").send(validUser);
    expect(response.status).toBe(201);
  });

  it("Should return 201 when POST /users/register with a Host is successful", async () => {
    const response = await client.post("/users/register").send(validUserHost);
    expect(response.status).toBe(201);
  });

  it("Should return 400 when POST /users/register with invalid data", async () => {
    const response = await client.post("/users/register").send(notValidUSer);
    expect(response.status).toBe(400);
  });

  //   LOGIN users

  it("Should return 200 and access tokens of type string when POST /users/login with a valid HOST login", async () => {
    const response = await client
      .post("/users/login")
      .send(validHostLogin)
      .expect(200);
    hostTokens = { ...response.body };
    expect(typeof hostTokens.accessToken).toBe("string");
  });

  it("Should return 200 and access tokens of type string when POST /users/login with a valid GUEST login", async () => {
    const response = await client
      .post("/users/login")
      .send(validGuestLogin)
      .expect(200);
    guestTokens = { ...response.body };
    expect(typeof guestTokens.accessToken).toBe("string");
  });

  it("Should return 401 when POST /users/login with an invalid login", async () => {
    const response = await client.post("/users/login").send(notValidUSer);
    expect(response.status).toBe(401);
  });

  //   GET ME

  it("Should return 404 POST /users/me", async () => {
    const response = await client
      .post("/users/me")
      .set("Authorization", `Bearer ${guestTokens.accessToken}`)
      .expect(404);
  });

  // Close MongoDB connection after suite finish

  afterAll(async () => {
    await mongoose.connection.close();
  });
});
