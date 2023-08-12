import vacationController from "@/controllers/vacation-controller";
import { validateBody } from "@/middlewares/validation-middleware";
import { vacationSchema } from "@/schemas/vacation-schemas";
import { Router } from "express";

const vacationRouter = Router()

vacationRouter
    .post("/", validateBody(vacationSchema), vacationController.createVacationPeriod)

export default vacationRouter