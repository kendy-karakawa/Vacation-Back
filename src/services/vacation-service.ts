import { badrequestError } from "@/errors/bad-request-error"
import { conflictError } from "@/errors/conflict-error"
import { ConcessionPeriod, CreateVacationData } from "@/protocols"
import employeeRepository from "@/repositories/employee-repository"
import vacationRepository from "@/repositories/vacation-repository"
import { VacationPeriod } from "@prisma/client"


async function createVacationPeriod(startDate:number, endDate:number, employeeId:number) {
    
    const hireDate = await employeeRepository.getHireDateById(employeeId)
    await isEligibleForVacation(hireDate, startDate)
    await isValidConsecutiveVacationDays(startDate, endDate)
    const concessionPeriod: ConcessionPeriod =  await checkConcessionPeriod(hireDate, startDate)
    await isValidVacationPeriod(startDate, endDate, concessionPeriod)
    await isValidVacationFracionation(startDate, endDate,employeeId, concessionPeriod)
    await isVacationPeriodOverlapping(startDate, endDate,employeeId, concessionPeriod)

    const data: CreateVacationData = {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        employeeId
    }

    const vacationPeriod = await vacationRepository.create(data)
    return vacationPeriod

}

async function isEligibleForVacation(hireDate: Date, startDate:number) {
    const dateInMilliseconds = Math.abs(startDate - hireDate.getTime())
    const diference = Math.ceil(dateInMilliseconds / (1000 * 60 * 60 * 24))
    if(diference <= 365) throw badrequestError("Neste periodo, o funcionário ainda não tem direito a férias.")
    
}

async function isValidConsecutiveVacationDays(startDate:number, endDate:number) {
    const consecutiveVacationDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1
    if(consecutiveVacationDays < 5) throw badrequestError("O periodo férias não podem ser inferior a 5 dias corridos")
    if(consecutiveVacationDays > 30) throw badrequestError("O periodo férias não podem ser superior a 30 dias corridos")
}

async function checkConcessionPeriod(hireDate: Date, startDate: number) {
    const hireMonth = hireDate.getMonth()
    const hireDay = hireDate.getDate()

    const desiredYear = new Date(startDate).getFullYear()
    const desiredmonth = new Date(startDate).getMonth()
    const desiredDay = new Date(startDate).getDate()

    const concessionEnd = new Date(hireDate)
    if(desiredmonth < hireMonth || desiredmonth === hireMonth && desiredDay < hireDay ) {
        concessionEnd.setFullYear(desiredYear)
        concessionEnd.setDate(hireDate.getDate() - 1)
    }else {
        concessionEnd.setFullYear(desiredYear + 1)
        concessionEnd.setDate(hireDate.getDate() - 1)
    }

    const concessionStart  = new Date(hireDate)
    concessionStart.setFullYear(concessionEnd.getFullYear() - 1)

    
    return {
        concessionStart,
        concessionEnd,
    }
}

async function isValidVacationPeriod(startDate:number, endDate:number, concessionPeriod: ConcessionPeriod) {
    const {concessionStart, concessionEnd} = concessionPeriod 

    const start = concessionStart.toISOString().split("T")[0]
    const end = concessionEnd.toISOString().split("T")[0]
    if(startDate <= concessionStart.getTime() ||  endDate >=  concessionEnd.getTime())
         throw badrequestError(`O colaborador deve tirar ferias entre o periodo de ${start} até ${end}.`)
}

async function isValidVacationFracionation(startDate:number, endDate:number, employeeId:number, concessionPeriod: ConcessionPeriod) {
    const consecutiveVacationDays = (endDate - startDate) / (1000 * 60 * 60 * 24) + 1
    const {concessionStart, concessionEnd} = concessionPeriod 
    const reservedPeriod: VacationPeriod[] = await vacationRepository.findVacationsWithinDateRange(employeeId,concessionStart, concessionEnd )
    if(reservedPeriod.length === 0) return
    if(reservedPeriod.length > 2) throw badrequestError("O funcionário não pode mais tirar férias")

    const daysTakenList = reservedPeriod.map(el => {
        const start = el.startDate.getTime();
        const end = el.endDate.getTime();
        return (end - start) / (1000 * 60 * 60 * 24) + 1
    })
    
    const totalDaysTaken = daysTakenList.reduce((acc, curr) => acc + curr, 0);
    if(totalDaysTaken === 30) throw badrequestError("O funcionário já tirou 30 dias de ferias")
    if(totalDaysTaken + consecutiveVacationDays > 30) throw badrequestError("As dastas selecionadas irão ultrapassar os 30 dias de ferias")
    
    const hasFourteenDaysPeriod = daysTakenList.some(days => days >= 14);
    if(reservedPeriod.length === 2 && !hasFourteenDaysPeriod && consecutiveVacationDays < 14) throw badrequestError("O periodo selecionado tem que ser de pelo menos 14 dias")
}

async function isVacationPeriodOverlapping(startDate:number, endDate:number, employeeId:number, concessionPeriod: ConcessionPeriod) {
    const {concessionStart, concessionEnd} = concessionPeriod 
    const reservedPeriod: VacationPeriod[] = await vacationRepository.findVacationsWithinDateRange(employeeId,concessionStart, concessionEnd )
    
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
    if(conflitedPeriod.length !== 0) throw conflictError("As datas estão se sobrepondo.")
}


const vacationService = {
    createVacationPeriod,

}

export default vacationService