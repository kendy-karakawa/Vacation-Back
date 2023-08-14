import { badrequestError } from "@/errors/bad-request-error";
import { conflictError } from "@/errors/conflict-error";
import employeeRepository from "@/repositories/employee-repository";
import vacationRepository from "@/repositories/vacation-repository";
import vacationService from "@/services/vacation-service";

describe("Vacation service test suite", () => {
  it("should respond with bad request error, when employee is not entitled to vacation", async () => {
    const hireDate = new Date("2023-08-11");
    const startDate = new Date("2024-05-01").getTime();
    const endDate = new Date("2024-05-30").getTime();
    const employeeId = 1;

    jest
      .spyOn(employeeRepository, "getHireDateById")
      .mockImplementationOnce((): any => {
        return hireDate;
      });

    await expect(
      vacationService.createVacationPeriod(startDate, endDate, employeeId)
    ).rejects.toEqual(
      badrequestError(
        "Neste periodo, o funcionário ainda não tem direito a férias."
      )
    );
  });

  it("should respond with bad request error, when consecutive vacation days is less then 5", async () => {
    const hireDate = new Date("2023-04-11");
    const employeeId = 1;
    const startDate = new Date("2024-05-01").getTime();
    const endDate = new Date("2024-05-03").getTime();

    jest
      .spyOn(employeeRepository, "getHireDateById")
      .mockImplementationOnce((): any => {
        return hireDate;
      });

    await expect(
      vacationService.createVacationPeriod(startDate, endDate, employeeId)
    ).rejects.toEqual(
      badrequestError(
        "O periodo férias não podem ser inferior a 5 dias corridos"
      )
    );
  });

  it("should respond with bad request error, when consecutive vacation days is bigger then 30", async () => {
    const hireDate = new Date("2023-04-11");
    const employeeId = 1;
    const startDate = new Date("2024-05-01").getTime();
    const endDate = new Date("2024-06-03").getTime();

    jest
      .spyOn(employeeRepository, "getHireDateById")
      .mockImplementationOnce((): any => {
        return hireDate;
      });

    await expect(
      vacationService.createVacationPeriod(startDate, endDate, employeeId)
    ).rejects.toEqual(
      badrequestError(
        "O periodo férias não podem ser superior a 30 dias corridos"
      )
    );
  });

  it("should respond with bad request error, when vacation end date is after concession period", async () => {
    const hireDate = new Date("2022-01-01");
    const employeeId = 1;
    const startDate = new Date("2024-12-09").getTime();
    const endDate = new Date("2025-01-02").getTime();

    jest
      .spyOn(employeeRepository, "getHireDateById")
      .mockImplementationOnce((): any => {
        return hireDate;
      });

    await expect(
      vacationService.createVacationPeriod(startDate, endDate, employeeId)
    ).rejects.toEqual(
      badrequestError(
        `O colaborador deve tirar ferias entre o periodo de 2024-01-01 até 2024-12-31.`
      )
    );
  });

  it("should with bad request error, when the employee already has more than 2 reserved vacation periods", async () => {
    const hireDate = new Date("2022-04-11");
    const employeeId = 1;
    const startDate = new Date("2023-05-05").getTime();
    const endDate = new Date("2023-05-15").getTime();

    jest
      .spyOn(employeeRepository, "getHireDateById")
      .mockImplementationOnce((): any => {
        return hireDate;
      });

    jest
      .spyOn(vacationRepository, "findVacationsWithinDateRange")
      .mockImplementationOnce((): any => {
        return [
          {
            startDate: new Date("2023-06-10"),
            endDate: new Date("2023-06-20"),
          },
          {
            startDate: new Date("2023-07-10"),
            endDate: new Date("2023-07-20"),
          },
          {
            startDate: new Date("2023-08-10"),
            endDate: new Date("2023-08-20"),
          },
        ];
      });

    await expect(
      vacationService.createVacationPeriod(startDate, endDate, employeeId)
    ).rejects.toEqual(
      badrequestError("O funcionário não pode mais tirar férias")
    );
  });

  it("should with bad request error, when the employee already took 30 days of vacation", async () => {
    const hireDate = new Date("2022-04-11");
    const employeeId = 1;
    const startDate = new Date("2023-08-05").getTime();
    const endDate = new Date("2023-08-15").getTime();

    jest
      .spyOn(employeeRepository, "getHireDateById")
      .mockImplementationOnce((): any => {
        return hireDate;
      });
    jest
      .spyOn(vacationRepository, "findVacationsWithinDateRange")
      .mockImplementationOnce((): any => {
        return [
          {
            startDate: new Date("2023-06-11"),
            endDate: new Date("2023-06-20"),
          },
          {
            startDate: new Date("2023-07-11"),
            endDate: new Date("2023-07-30"),
          },
        ];
      });

    await expect(
      vacationService.createVacationPeriod(startDate, endDate, employeeId)
    ).rejects.toEqual(
      badrequestError("O funcionário já tirou 30 dias de ferias")
    );
  });

  it("should with bad request error, when the total days taken after the current request exceeds 30 days", async () => {
    const hireDate = new Date("2022-04-11");
    const employeeId = 1;
    const startDate = new Date("2023-08-05").getTime();
    const endDate = new Date("2023-08-25").getTime();

    jest
      .spyOn(employeeRepository, "getHireDateById")
      .mockImplementationOnce((): any => {
        return hireDate;
      });
    jest
      .spyOn(vacationRepository, "findVacationsWithinDateRange")
      .mockImplementationOnce((): any => {
        return [
          {
            startDate: new Date("2023-06-11"),
            endDate: new Date("2023-06-20"),
          },
          {
            startDate: new Date("2023-07-11"),
            endDate: new Date("2023-07-20"),
          },
        ];
      });

    await expect(
      vacationService.createVacationPeriod(startDate, endDate, employeeId)
    ).rejects.toEqual(
      badrequestError(
        "As dastas selecionadas irão ultrapassar os 30 dias de ferias"
      )
    );
  });

  it("should with bad request error, when selected period must be at least 14 days", async () => {
    const hireDate = new Date("2022-04-11");
    const employeeId = 1;
    const startDate = new Date("2023-08-05").getTime();
    const endDate = new Date("2023-08-10").getTime();

    jest
      .spyOn(employeeRepository, "getHireDateById")
      .mockImplementationOnce((): any => {
        return hireDate;
      });

    jest
      .spyOn(vacationRepository, "findVacationsWithinDateRange")
      .mockImplementationOnce((): any => {
        return [
          {
            startDate: new Date("2023-06-11"),
            endDate: new Date("2023-06-15"),
          },
          {
            startDate: new Date("2023-07-11"),
            endDate: new Date("2023-07-20"),
          },
        ];
      });

    await expect(
      vacationService.createVacationPeriod(startDate, endDate, employeeId)
    ).rejects.toEqual(
      badrequestError("O periodo selecionado tem que ser de pelo menos 14 dias")
    );
  });

  it("should with bad request error, when startDate is between the period of another vacation", async () => {
    const hireDate = new Date("2022-04-11");
    const employeeId = 1;
    const startDate = new Date("2023-06-05").getTime();
    const endDate = new Date("2023-06-17").getTime();

    jest
      .spyOn(employeeRepository, "getHireDateById")
      .mockImplementationOnce((): any => {
        return hireDate;
      });

    jest
      .spyOn(vacationRepository, "findVacationsWithinDateRange")
      .mockImplementationOnce((): any => {
        return [
          {
            startDate: new Date("2023-06-01"),
            endDate: new Date("2023-06-08"),
          },
        ];
      });

    jest
      .spyOn(vacationRepository, "findVacationsWithinDateRange")
      .mockImplementationOnce((): any => {
        return [
          {
            startDate: new Date("2023-06-01"),
            endDate: new Date("2023-06-08"),
          },
        ];
      });

    await expect(
      vacationService.createVacationPeriod(startDate, endDate, employeeId)
    ).rejects.toEqual(conflictError("As datas estão se sobrepondo."));
  });

  it("should with bad request error, when endDate is between the period of another vacation", async () => {
    const hireDate = new Date("2022-04-11");
    const employeeId = 1;
    const startDate = new Date("2023-05-25").getTime();
    const endDate = new Date("2023-06-02").getTime();

    jest
      .spyOn(employeeRepository, "getHireDateById")
      .mockImplementationOnce((): any => {
        return hireDate;
      });

    jest
      .spyOn(vacationRepository, "findVacationsWithinDateRange")
      .mockImplementationOnce((): any => {
        return [
          {
            startDate: new Date("2023-06-01"),
            endDate: new Date("2023-06-08"),
          },
        ];
      });

    jest
      .spyOn(vacationRepository, "findVacationsWithinDateRange")
      .mockImplementationOnce((): any => {
        return [
          {
            startDate: new Date("2023-06-01"),
            endDate: new Date("2023-06-08"),
          },
        ];
      });

    await expect(
      vacationService.createVacationPeriod(startDate, endDate, employeeId)
    ).rejects.toEqual(conflictError("As datas estão se sobrepondo."));
  });

  it("should with bad request error, when the period of another vacation is between this vacation period ", async () => {
    const hireDate = new Date("2022-04-11");
    const employeeId = 1;
    const startDate = new Date("2023-05-30").getTime();
    const endDate = new Date("2023-06-09").getTime();

    jest
      .spyOn(employeeRepository, "getHireDateById")
      .mockImplementationOnce((): any => {
        return hireDate;
      });

    jest
      .spyOn(vacationRepository, "findVacationsWithinDateRange")
      .mockImplementationOnce((): any => {
        return [
          {
            startDate: new Date("2023-06-01"),
            endDate: new Date("2023-06-08"),
          },
        ];
      });

    jest
      .spyOn(vacationRepository, "findVacationsWithinDateRange")
      .mockImplementationOnce((): any => {
        return [
          {
            startDate: new Date("2023-06-01"),
            endDate: new Date("2023-06-08"),
          },
        ];
      });

    await expect(
      vacationService.createVacationPeriod(startDate, endDate, employeeId)
    ).rejects.toEqual(conflictError("As datas estão se sobrepondo."));
  });
});
