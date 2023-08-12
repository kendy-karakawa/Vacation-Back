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

const employeeRepository = {
  create,
  findByName,
};

export default employeeRepository;
