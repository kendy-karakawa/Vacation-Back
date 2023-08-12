import employeeService from "@/services/employee-service"
import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status"


async function addEmployee(req: Request, res: Response, next: NextFunction) {
    const {name, position, hireDate } = req.body 
    try {
        await employeeService.addEmployee(name, position, hireDate )
        res.sendStatus(httpStatus.CREATED)
    } catch (error) {
        next(error)
    }
}

async function getAllEmployees(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await employeeService.getAllEmployees()
        res.status(httpStatus.OK).send(result)
    } catch (error) {
        next(error)
    }
}

const employeeController = {
    addEmployee,
    getAllEmployees
}

export default employeeController