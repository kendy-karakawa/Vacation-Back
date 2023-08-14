import app, { init } from "@/app";
import { prisma } from "@/config";
import httpStatus from "http-status";
import supertest from "supertest";
import { createEmployee } from "../factories/employee.factory";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await prisma.employee.deleteMany({});
});

const server = supertest(app);

describe("POST /employee", () => {
  it("should respond with status 400 when body is not given", async () => {
    const result = await server.post("/employee");
    expect(result.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body is not valid", async () => {
    const invalidBody = {
      name: "kendy",
      position: "t",
      hireDate: 1660532400000,
    };

    const response = await server.post("/employee").send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    it("should respond with status 409 when there is an employee with given name", async () => {
      await createEmployee("kendy");

      const body = {
        name: "kendy",
        position: "back-end",
        hireDate: 1660532400000,
      };

      const response = await server.post("/employee").send(body);
      expect(response.status).toBe(httpStatus.CONFLICT);
      expect(response.body).toEqual({
        message: "Ja existe um colaborador com este nome",
      });
    });

    it("should respond with status 201 and create user when given email is unique", async () => {
      const body = {
        name: "kendy",
        position: "back-end",
        hireDate: 1660532400000,
      };

      const response = await server.post("/employee").send(body);

      expect(response.status).toBe(httpStatus.CREATED);
    });
  });
});

describe("PUT /employee/:id", () => {
  it("should respond with status 400 when body is not valid", async () => {
    const { id } = await createEmployee("kendy");
    const invalidBody = {
      position: "t",
    };

    const response = await server.put(`/employee/${id}`).send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    it("should respond with status 404 when there is not an employee with given id", async () => {
      const id = 50;
      const body = {
        name: "kendy",
      };
      const response = await server.put(`/employee/${id}`).send(body);
      expect(response.status).toBe(httpStatus.NOT_FOUND);
      expect(response.body).toEqual({
        message: "Colaborador não encontrado!",
      });
    });

    it("should respond with status 409 when there is an employee with given name", async () => {
      await createEmployee("kendy");
      const { id } = await createEmployee("Thiago");
      const body = {
        name: "kendy",
      };

      const response = await server.put(`/employee/${id}`).send(body);
      expect(response.status).toBe(httpStatus.CONFLICT);
      expect(response.body).toEqual({
        message: "Ja existe um colaborador com este nome",
      });
    });

    it("should respond with status 200 and update", async () => {
      await createEmployee("kendy");
      const { id } = await createEmployee("Thiago");
      const body = {
        name: "Tiago",
      };

      const response = await server.put(`/employee/${id}`).send(body);

      expect(response.status).toBe(httpStatus.OK);
    });
  });
});

describe("GET /employee", () => {
  it("should respond with status 404, when there is no employee.", async () => {
    const response = await server.get(`/employee/`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });
  it("should respond with status 200, when have employees.", async () => {
    await createEmployee("kendy");

    const response = await server.get(`/employee/`);

    expect(response.status).toBe(httpStatus.OK);
  });
});

describe("DELETE /employee", () => {
  it("should respond with status 404 when there is not an employee with given id", async () => {
    const id = 50;
    const response = await server.delete(`/employee/${id}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND);
    expect(response.body).toEqual({
      message: "Colaborador não encontrado!",
    });
  });
  it("should respond with status 200 when deleted", async () => {
    const { id } = await createEmployee("Thiago");
    

    const response = await server.delete(`/employee/${id}`);

    expect(response.status).toBe(httpStatus.OK);
  });
});
