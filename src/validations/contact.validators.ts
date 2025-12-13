import Joi from "joi";

export const createContactSchema = Joi.object({
  name: Joi.string().min(2).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().max(15).optional(),
  message: Joi.string().min(10).max(200).required(),
});
