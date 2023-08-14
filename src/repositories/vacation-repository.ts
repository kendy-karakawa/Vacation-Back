import { prisma } from "@/config";
import { CreateVacationData } from "@/protocols";

async function create(data: CreateVacationData) {
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

async function findVacationsWithinDateRange(employeeId: number, concessionStart: Date, concessionEnd: Date) {
  const vacationPeriods = await prisma.vacationPeriod.findMany({
    where:{
      employeeId,
      OR:[
        {
          startDate:{
            gte: concessionStart,
            lte: concessionEnd
          }
        },
        {
          endDate:{
            gte: concessionStart,
            lte: concessionEnd
          }
        }
      ]
    }
  })

  return vacationPeriods;
}

const vacationRepository = {
  create,
  findAllByEmployeeId,
  findVacationsWithinDateRange
};

export default vacationRepository;
