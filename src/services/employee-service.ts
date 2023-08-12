import { conflictError } from "@/errors/conflict-error";
import { AddEmployeeData } from "@/protocols";
import employeeRepository from "@/repositories/employee-repository";
import dayjs = require("dayjs");

async function addEmployee(name: string, position: string, date:number ) {
  await checkEmployeeExistence(name);
  const formatedDate = await formatDate(date)

  const data: AddEmployeeData = {
    name,
    position,
    hireDate: formatedDate
  }

  return await employeeRepository.create(data);
}

async function formatDate(date: number) {
  const formatedDate = dayjs(date).toISOString()
  return dayjs(formatedDate).toDate()
    
}

async function checkEmployeeExistence(name: string) {
  const nameAlreadyExist = await employeeRepository.findByName(name);
  if (nameAlreadyExist) throw conflictError("This employee already exist!");
}
const employeeService = {
  addEmployee,
};

export default employeeService;
