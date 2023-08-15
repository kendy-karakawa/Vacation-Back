import vacationService from "@/services/vacation-service"
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"


async function createVacationPeriod(req: Request, res: Response, next: NextFunction) {
    const {startDate, endDate, id} = req.body
    try {
        const result = await vacationService.createVacationPeriod(startDate, endDate, id)
        res.status(httpStatus.CREATED).send(result)
    } catch (error) {
        next(error)
    }
}



const vacationController = {
    createVacationPeriod
}

export default vacationController