import { badrequestError } from "@/errors/bad-request-error"
import { conflictError } from "@/errors/conflict-error"
import { ConcessionPeriod } from "@/protocols"
import employeeRepository from "@/repositories/employee-repository"
import vacationRepository from "@/repositories/vacation-repository"
import { VacationPeriod } from "@prisma/client"


async function createVacationPeriod(startDate:number, endDate:number, employeeId:number) {
    const hireDate = await employeeRepository.getHireDateById(employeeId)
    await isEligibleForVacation(hireDate, startDate)
    const concessionPeriod: ConcessionPeriod =  await checkConcessionPeriod(hireDate, startDate)
    await isValidVacationFracionationOrPeriod(startDate, endDate, employeeId, concessionPeriod)
}

async function isEligibleForVacation(hireDate: Date, startDate:number) {
    const dateInMilliseconds = Math.abs(startDate - hireDate.getTime())
    const diference = Math.ceil(dateInMilliseconds / (1000 * 60 * 60 * 24))
    if(diference <= 365) throw badrequestError("Neste periodo, o funcionário ainda não tem direito a férias.")
    
}

async function checkConcessionPeriod(hireDate: Date, startDate: number) {
    const hireYear = hireDate.getFullYear()
    const desiredYear = new Date(startDate).getFullYear()
    
    const differenceYear = desiredYear - hireYear
    if(differenceYear === 0 ) throw badrequestError("Neste periodo, o funcionário ainda não tem direito a férias.")

    const concessionStart = new Date(hireDate) 
    concessionStart.setFullYear(hireDate.getFullYear() + differenceYear )
    
    const concessionEnd = new Date(hireDate) 
    concessionEnd.setFullYear(concessionStart.getFullYear() + 1)
    concessionEnd.setDate(hireDate.getDate() - 1)

    console.log(concessionStart)
    console.log(hireDate.getDate())
    console.log(concessionEnd)

    return {concessionStart, concessionEnd}
    
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

async function isValidVacationFracionationOrPeriod(startDate:number, endDate:number, employeeId:number, concessionPeriod: ConcessionPeriod) {
    const consecutiveVacationDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1
    if(consecutiveVacationDays < 5) throw badrequestError("O periodo férias não podem ser inferior a 5 dias corridos")
    if(consecutiveVacationDays > 30) throw badrequestError("O periodo férias não podem ser superior a 30 dias corridos")
    await isValidVacationPeriod(startDate, endDate, concessionPeriod)
}

async function isValidVacationPeriod(startDate:number, endDate:number, concessionPeriod: ConcessionPeriod) {
    const {concessionStart, concessionEnd} = concessionPeriod 

    const start = concessionStart.toISOString().split("T")[0]
    const end = concessionEnd.toISOString().split("T")[0]

    if(concessionStart.getTime() <= startDate && startDate <= concessionEnd.getTime())
        throw badrequestError(`O colaborador deve tirar ferias entre o periodo de ${start} até ${end}.`)
    if(concessionStart.getTime() <= endDate && endDate <= concessionEnd.getTime())
         throw badrequestError(`O colaborador deve tirar ferias entre o periodo de ${start} até ${end}.`)
    if(startDate < concessionStart.getTime() && concessionEnd.getTime() < endDate)
         throw badrequestError(`O colaborador deve tirar ferias entre o periodo de ${start} até ${end}.`)
}


const vacationService = {
    createVacationPeriod
}

export default vacationService