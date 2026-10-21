import { BadRequestException } from "../Utils/respones/err.respones.js";
import joi from "joi";
import mongoose from "mongoose"
import {
  genderEnum,
  roleEnum,
  providerEnum,
} from "../Utils/enums/user.enum.js";
export const generalFileds = {
     
    userName: joi.string().min(2).max(35),
    email: joi
      .string()
      .email({
        minDomainSegments: 2,
        maxDomainSegments: 5,
        tlds: { allow: ["com", "net"] },
      })
      ,
    password: joi.string().min(8).max(64),
    confirmPassword: joi.string().valid(joi.ref("password")).messages({ "any.only": "confirmPassword must match password" }),
    phone: joi.string().pattern(/^(?:\+20|0020|20|0)1[0125]\d{8}$/),
    gender: joi.number().valid(...Object.values(genderEnum)),
    role: joi.number().valid(...Object.values(roleEnum)),
    provider: joi.number().valid(...Object.values(providerEnum)),
    DOB: joi.string().isoDate(),
    confirmEmail: joi.string().isoDate(),
    profilePic: joi.string(),
    coverPic: joi.array().items(joi.string()),
    ProfileVideo: joi.array().items(joi.string()),
    otp:joi.string().pattern(/^\d{6}$/),
    content:joi.string().min(1).max(500).messages({
      "string.empty":"message Cannot be empty",
      "string.max":"message Cannot exceed 500 Character"
    }),
    oldPassword: joi.string(),
    newPassword: joi.string().min(8).max(64),
    confirmResetPassword: joi.string().valid(joi.ref("newPassword"))
  .messages({ "any.only": "confirmPassword must match newPassword" }),
   confirmUpdatePasword: joi.string().valid(joi.ref("newPassword"))
  .messages({ "any.only": "confirmPassword must match newPassword" }),
  userId: joi.string().custom((value, helper) => {
  if (mongoose.Types.ObjectId.isValid(value)) {
    return value;
  }

  return helper.message("Invalid ObjectId format");
}),
receiverId: joi.string().custom((value, helper) => {
  if (mongoose.Types.ObjectId.isValid(value)) {
    return value;
  }

  return helper.message("Invalid ObjectId format");
}),
messageId: joi.string().custom((value, helper) => {
  if (mongoose.Types.ObjectId.isValid(value)) {
    return value;
  }

  return helper.message("Invalid ObjectId format");
}),


}



export const validation = (schema)=>{
    return (req,res,next)=>{
        const validationError = [];
        for (const Key of Object.keys(schema)) {

            const validationResults = schema[Key].validate(req[Key], { abortEarly: false });
            
            if(validationResults.error) validationError.push({Key,details:validationResults.error.details})}

            if(validationError.length) throw BadRequestException({message:"validation error",extra:validationError});
        
        
        return next();
    }
}