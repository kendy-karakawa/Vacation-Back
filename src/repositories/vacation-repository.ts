import { prisma } from "@/config";
import { CreateVacationData } from "@/protocols";

async function create(data: CreateVacationData) {
  const result = await prisma.vacationPeriod.create({
    data,
  });

  return result
}

async function findAllByEmployeeId(employeeId: number) {
  const result = await prisma.vacationPeriod.findMany({
    where: {
      employeeId,
    },
  });

  return result
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
