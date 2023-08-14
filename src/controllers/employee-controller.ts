import { UpDateEmployeeData } from "@/protocols"
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

async function updateEmployee(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id)
    const data = req.body as UpDateEmployeeData
    try {
        await employeeService.updateEmployee(id, data)
        res.sendStatus(httpStatus.OK)
    } catch (error) {
        next(error)
    }
}

async function deleteEmployee(req: Request, res: Response, next: NextFunction) {
    const id = parseInt(req.params.id)
    try {
        await employeeService.deleteEmployee(id)
        res.sendStatus(httpStatus.OK)
    } catch (error) {
        next(error)
    }
}

const employeeController = {
    addEmployee,
    getAllEmployees,
    updateEmployee,
    deleteEmployee
}

export default employeeController