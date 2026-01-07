import { describe, expect, it } from "bun:test";
import app from ".";
import { db } from "./libs/db";
import { users } from "./schemas/user.schema";
import { eq } from "drizzle-orm";

describe("Check if the server is working", () => {
  it("Should return 200 Response", async () => {
    const req = new Request(`http://localhost:${process.env.PORT || 3000}/`);
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
  });
});

describe("Check if the signup route is woking", () => {
  const testData = {
    username: "some name",
    email: "somenaome@mail.com",
    password: "simple123",
  };
  it("Sould return 200 Response", async () => {
    const req = new Request(
      `http://localhost:${process.env.PORT || 3000}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      },
    );
    const res = await app.fetch(req);
    expect(res.status).toBe(200);
  });
});

describe("Check if the signup validation is woking", () => {
  const testData = {
    username: "so",
    email: "somenaome@mail.com",
    password: "simple123",
  };
  const testData2 = {
    username: "somealfkie",
    email: "somenaome@mail.com",
    password: "123",
  };
  // to check if email username is the desired length
  it("Sould return 400 Response", async () => {
    const req = new Request(
      `http://localhost:${process.env.PORT || 3000}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      },
    );
    const res = await app.fetch(req);
    expect(res.status).toBe(400);
  });
  // to check if the password is desired length
  it("Sould return 400 Response", async () => {
    const req = new Request(
      `http://localhost:${process.env.PORT || 3000}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData2),
      },
    );
    const res = await app.fetch(req);
    expect(res.status).toBe(400);
  });
});

describe("Check if the signup route is woking", () => {
  const testData = {
    username: "some name",
    email: "somenaome@mail.com",
    password: "simple123",
  };
  it("Sould return 409 Response", async () => {
    const req = new Request(
      `http://localhost:${process.env.PORT || 3000}/api/auth/register`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testData),
      },
    );
    const res = await app.fetch(req);
    expect(res.status).toBe(409);

    await db.delete(users).where(eq(users.email, testData.email));
  });
});
