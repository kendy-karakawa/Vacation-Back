-- DropForeignKey
ALTER TABLE "VacationPeriod" DROP CONSTRAINT "VacationPeriod_employeeId_fkey";

-- AddForeignKey
ALTER TABLE "VacationPeriod" ADD CONSTRAINT "VacationPeriod_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "Employee"("id") ON DELETE CASCADE ON UPDATE CASCADE;
