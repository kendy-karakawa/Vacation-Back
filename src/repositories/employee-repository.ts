import { prisma } from "@/config";
import { AddEmployeeData, UpDateEmployeeData } from "@/protocols";


async function create(data: AddEmployeeData) {
  return await prisma.employee.create({ data });
}

async function findByName(name: string) {
  return await prisma.employee.findFirst({
    where: {
      name,
    },
  });
}

async function getHireDateById(id: number) {
  const date = await prisma.employee.findFirst({
    where: { id },
    select: { hireDate: true },
  });

  return date.hireDate
}

async function getAll() {
  return await prisma.employee.findMany({});
}

async function upDate(id: number, data: UpDateEmployeeData) {
  return await prisma.employee.update({
    where:{
      id
    },
    data
  })
}

async function deleteEmployee(id: number) {
  return await prisma.employee.delete({
    where: {id}
  })
}

async function getById(id: number) {
  const result = await prisma.employee.findFirst({
    where: {id}
  })

  return result 
}

const employeeRepository = {
  create,
  findByName,
  getAll,
  getHireDateById,
  upDate,
  deleteEmployee,
  getById
};

export default employeeRepository;
