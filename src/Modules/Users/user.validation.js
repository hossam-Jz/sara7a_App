import joi from "joi";
import {generalFileds} from "../../Middlewares/validation.middleware.js"

export const updatePasswordSchema = {
  body: joi.object({
    oldPassword: generalFileds.oldPassword.required(),
    newPassword: generalFileds.newPassword.required(),
    confirmPassword: generalFileds.confirmUpdatePasword.required(),
  })
};

export const freezeSchema = {
  params: joi.object({
    userId:generalFileds.userId
  })
}
export const restoreSchema = {
  params: joi.object({
    userId:generalFileds.userId
  })
}
export const hardDeleteSchema = {
  params: joi.object({
    userId:generalFileds.userId
  })
}