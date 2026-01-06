import { describe, expect, it } from "bun:test";
import app from ".";
import { db } from "./libs/db";
import { users } from "./schemas/user.schema";
import { eq } from "drizzle-orm";

describe("Check if the server is working", () => {
  it("Should return 200 Response", async () => {
    const req = new Request(`http://localhost:${process.env.PORT}/`);
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
      `http://localhost:${process.env.PORT}/api/auth/register`,
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

describe("Check if the signup route is woking", () => {
  const testData = {
    username: "some name",
    email: "somenaome@mail.com",
    password: "simple123",
  };
  it("Sould return 409 Response", async () => {
    const req = new Request(
      `http://localhost:${process.env.PORT}/api/auth/register`,
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

    db.delete(users).where(eq(users.email, testData.email));
  });
});
