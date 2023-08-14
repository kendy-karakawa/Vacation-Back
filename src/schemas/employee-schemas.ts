import { AddEmployeeData } from "@/protocols";
import Joi from "joi";

export const employeeSchema = Joi.object<AddEmployeeData>({
    name: Joi.string().min(2).required(),
    position: Joi.string().min(2).required(),
    hireDate: Joi.number().min(3162240000).required()
})

export const putEmployeeSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().min(2),
    position: Joi.string().min(2),
    hireDate: Joi.number().min(3162240000)
})