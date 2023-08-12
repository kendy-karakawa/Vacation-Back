import { prisma } from "@/config";
import { AddEmployeeData } from "@/protocols";
import { Prisma } from "@prisma/client";

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

const employeeRepository = {
  create,
  findByName,
  getAll,
  getHireDateById,
};

export default employeeRepository;
