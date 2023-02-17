import supertest from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { expressServer } from "../server";
import UsersModel from "../api/user/model";

dotenv.config();

const client = supertest(expressServer);

const correctAccommodation = {
  name: "EUROPA PLATZ",
  description: "test description",
  maxGuests: 4,
  city: "Santander",
};

const notValidAccommodation = {
  name: "EUROPA PLATZ",
  description: "test description",
  maxGuests: "INVALID MAX GUESTS",
  city: "Santander",
};

let newAccommodationId: string;

beforeAll(async () => {
  if (process.env.MONGO_URL) {
    await mongoose.connect(process.env.MONGO_URL);
  }
});

//   Mongo check

it("Should check that Mongo connection string is not undefined", () => {
  expect(process.env.MONGO_URL).toBeDefined();
});

//   GET accommodations

it("Should return 401 when GET /accommodations is successful", async () => {
  const response = await client.get("/accommodations");
  expect(response.status).toBe(401);
});

// Close MongoDB connection after suite finish

afterAll(async () => {
  await mongoose.connection.close();
});
