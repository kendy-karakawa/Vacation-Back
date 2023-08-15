import app, { init } from "@/app";
import { prisma } from "@/config";
import httpStatus from "http-status";
import supertest from "supertest";
import {
  createEmployee,
  createEmployeeWithParamsData,
} from "../factories/employee.factory";

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await prisma.vacationPeriod.deleteMany({});
  await prisma.employee.deleteMany({});
});

const server = supertest(app);

describe("POST /vacation", () => {
  it("should respond with status 400, when body is not given", async () => {
    const result = await server.post("/vacation");
    expect(result.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body id is not valid", async () => {
    const toDay = new Date().getTime();
    const oneDay = 86400000;
    const startDate = toDay + oneDay;
    const endDate = toDay + oneDay * 6;

    const invalidBody = {
      id: "one",
      startDate: startDate,
      endDate: endDate,
    };

    const response = await server.post("/vacation").send(invalidBody);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when startDate is less than today", async () => {
    const toDay = new Date().getTime();
    const oneDay = 86400000;
    const startDate = toDay - oneDay;
    const endDate = toDay + oneDay * 5;

    const invalidBody = {
      id: 1,
      startDate: startDate,
      endDate: endDate,
    };

    const response = await server.post("/vacation").send(invalidBody);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it("should respond with status 400 when body endDate is before startDate", async () => {
    const toDay = new Date().getTime();
    const oneDay = 86400000;
    const startDate = toDay + oneDay;
    const endDate = toDay - oneDay * 2;

    const invalidBody = {
      id: 1,
      startDate: startDate,
      endDate: endDate,
    };

    const response = await server.post("/vacation").send(invalidBody);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  describe("when body is valid", () => {
    it("should respond with status 201 and create vacation period", async () => {
      const toDay = new Date();
      const toDayMiliseconds = toDay.getTime();
      const oneDay = 86400000;
      const startDate = toDayMiliseconds + oneDay;
      const endDate = toDayMiliseconds + oneDay * 10;

      const data = {
        name: "Kendy",
        position: "back-end",
        hireDate: new Date("2020-01-01"),
      };

      const { id } = await createEmployeeWithParamsData(data);

      const body = {
        id: id,
        startDate: startDate,
        endDate: endDate,
      };

      const response = await server.post("/vacation").send(body);
      expect(response.status).toBe(httpStatus.CREATED);
      expect(response.body).toEqual({
        id: expect.any(Number),
        startDate: new Date(body.startDate).toISOString(),
        endDate: new Date(body.endDate).toISOString(),
        employeeId: body.id,
      });
    });
  });
});
