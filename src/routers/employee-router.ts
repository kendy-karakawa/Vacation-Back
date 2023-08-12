import employeeController from "@/controllers/employee-controller";
import { validateBody } from "@/middlewares/validation-middleware";
import { employeeSchema } from "@/schemas/employee-schemas";
import { Router } from "express";

const employeeRouter = Router()

employeeRouter
    .post("/", validateBody(employeeSchema), employeeController.addEmployee)


export default employeeRouter;