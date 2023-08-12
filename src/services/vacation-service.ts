import { badrequestError } from "@/errors/bad-request-error"
import { conflictError } from "@/errors/conflict-error"
import employeeRepository from "@/repositories/employee-repository"
import vacationRepository from "@/repositories/vacation-repository"
import { VacationPeriod } from "@prisma/client"


async function createVacationPeriod(startDate:number, endDate:number, employeeId:number) {
    const hireDate = await employeeRepository.getHireDateById(employeeId)
    await isEligibleForVacation(hireDate, startDate)
}

async function isEligibleForVacation(hireDate: Date, startDate:number) {
    const dateInMilliseconds = Math.abs(startDate - hireDate.getTime())
    const diference = Math.ceil(dateInMilliseconds / (1000 * 60 * 60 * 24))
    if(diference <= 365) throw badrequestError("The requested vacation date falls before the eligible period.")
}

async function isVacationPeriodOverlapping(startDate:number, endDate:number, employeeId:number) {
    const reservedPeriod: VacationPeriod[] = await vacationRepository.findAllByEmployeeId(employeeId)
    if(!reservedPeriod) return 
    const conflitedPeriod = reservedPeriod.filter((el)=> {
        if(el.startDate.getTime() <= startDate && startDate <= el.endDate.getTime())
        return true;
        if(el.startDate.getTime() <= endDate && endDate <= el.endDate.getTime())
        return true;
        if(startDate < el.startDate.getTime() && el.endDate.getTime() < endDate)
        return true;
    return false
    })
    if(conflitedPeriod.length !== 0) throw conflictError("The dates are overlapping.")
}

async function isValidVacationFracionation(startDate:number, endDate:number, employeeId:number) {
    const consecutiveVacationDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1
    if(consecutiveVacationDays < 5) throw badrequestError("O periodo férias não podem ser inferior a 5 dias corridos")
}



const vacationService = {
    createVacationPeriod
}

export default vacationService