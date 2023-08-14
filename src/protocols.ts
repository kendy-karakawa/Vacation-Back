import { type } from "os";

export type ApplicationError = {
  name: string;
  message: string;
};

export type AddEmployeeData = {
  name: string;
  position: string;
  hireDate: Date;
};

export type UpDateEmployeeData = {
  name?: string;
  position?: string;
  hireDate?: Date;
}

export type CreateVacationData = {
  startDate: Date;
  endDate: Date;
  employeeId: number;
};

export type ConcessionPeriod = {
  concessionStart: Date,
  concessionEnd: Date
}