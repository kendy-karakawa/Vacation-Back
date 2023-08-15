import employeeController from "@/controllers/employee-controller";
import { validateBody, validateParams } from "@/middlewares/validation-middleware";
import { employeeSchema, putEmployeeSchema } from "@/schemas/employee-schemas";
import { Router } from "express";

const employeeRouter = Router()

employeeRouter
    .post("/", validateBody(employeeSchema), employeeController.addEmployee)
    .get("/", employeeController.getAllEmployees)
    .put("/:id",validateBody(putEmployeeSchema), employeeController.updateEmployee)
    .delete("/:id", employeeController.deleteEmployee )
    .get("/:id", employeeController.getEmployeeData)


export default employeeRouter;