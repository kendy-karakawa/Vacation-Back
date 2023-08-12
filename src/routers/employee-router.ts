import employeeController from "@/controllers/employee-controller";
import { validateBody } from "@/middlewares/validation-middleware";
import employeeRepository from "@/repositories/employee-repository";
import { employeeSchema } from "@/schemas/employee-schemas";
import { Router } from "express";

const employeeRouter = Router()

employeeRouter
    .post("/", validateBody(employeeSchema), employeeController.addEmployee)
    .get("/", employeeController.getAllEmployees)


export default employeeRouter;