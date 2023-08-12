import { prisma } from "@/config";

async function create(data) {
  return await prisma.vacationPeriod.create({
    data,
  });
}

async function findAllByEmployeeId(employeeId: number) {
  return await prisma.vacationPeriod.findMany({
    where: {
      employeeId,
    },
  });
}

const vacationRepository = {
  create,
  findAllByEmployeeId
};

export default vacationRepository;
