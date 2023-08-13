import Joi from "joi";

export const vacationSchema = Joi.object({
    id: Joi.number().required(),
    startDate: Joi.date().required().greater('now'),
    endDate: Joi.date().greater(Joi.ref('startDate')).required(),
})