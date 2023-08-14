import { conflictError } from "@/errors/conflict-error";
import { notFoundError } from "@/errors/not-found-error";
import { AddEmployeeData, UpDateEmployeeData } from "@/protocols";
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
  if(employees.length === 0) throw notFoundError("There are no registered employees!") 
  return employees
}

async function updateEmployee(id: number, data: UpDateEmployeeData) {
  const employee = await employeeRepository.getById(id)
  if(!employee) throw notFoundError("Colaborador não encontrado!")
  if(data.name) await checkEmployeeExistence(data.name)
  return await employeeRepository.upDate(id, data)
  
}

async function deleteEmployee(id: number) {
  const employee = await employeeRepository.getById(id)
  if(!employee) throw notFoundError("Colaborador não encontrado!")
  return await employeeRepository.deleteEmployee(id)
}

async function checkEmployeeExistence(name: string) {
  const nameAlreadyExist = await employeeRepository.findByName(name);
  if (nameAlreadyExist) throw conflictError("Ja existe um colaborador com este nome");
}


const employeeService = {
  addEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee
};

export default employeeService;
