import Joi from "joi";

export const vacationSchema = Joi.object({
    id: Joi.number().required(),
    startDate: Joi.number().required(),
    endDate: Joi.number().required(),
})