import joi from "joi";

import { generalFileds } from "../../Middlewares/validation.middleware.js";

export const signupSchema = {
  body: joi.object({
    userName : generalFileds.userName.required(),
    email: generalFileds.email.required(),
    password: generalFileds.password.required(),
    confirmPassword: generalFileds.confirmPassword,
    phone: generalFileds.phone,
    gender: generalFileds.gender,
    role: generalFileds.role,
    provider: generalFileds.provider,
    DOB: generalFileds.DOB,
    confirmEmail: generalFileds.confirmEmail,
    profilePic: generalFileds.profilePic,
    coverPic: generalFileds.coverPic,
    ProfileVideo: generalFileds.ProfileVideo,
  })
};
export const loginSchema = {
  body: joi.object({
     email: generalFileds.email.required(),
    password: generalFileds.password.required(),
  }),
};
export const confirmEmailSchema = {
  body: joi.object({
     email: generalFileds.email.required(),
    otp: generalFileds.otp
  }),
};
export const forgetPasswordSchema = {
  body: joi.object({
     email: generalFileds.email.required()
  }),
};
export const resetPasswordSchema = {
  body: joi.object({
     email: generalFileds.email.required(),
     newPassword:generalFileds.newPassword.required(),
     otp:generalFileds.otp,
     confirmPassword:generalFileds.confirmResetPassword
  })
};
