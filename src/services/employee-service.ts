import { conflictError } from "@/errors/conflict-error";
import { notFoundError } from "@/errors/not-found-error";
import { AddEmployeeData } from "@/protocols";
import employeeRepository from "@/repositories/employee-repository";


async function addEmployee(name: string, position: string, date:number ) {
  await checkEmployeeExistence(name);
  const formatedDate = new Date(date)

  const data: AddEmployeeData = {
    name,
    position,
    hireDate: formatedDate
  }

  return await employeeRepository.create(data);
}

async function getAllEmployees() {
  const employees = await employeeRepository.getAll() 
  if(!employees) throw notFoundError("There are no registered employees!") 
  return employees
}

async function checkEmployeeExistence(name: string) {
  const nameAlreadyExist = await employeeRepository.findByName(name);
  if (nameAlreadyExist) throw conflictError("This employee already exist!");
}
const employeeService = {
  addEmployee,
  getAllEmployees
};

export default employeeService;
