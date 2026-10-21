import { generalFileds } from "../../Middlewares/validation.middleware.js";
import joi from "joi";

export const sendMessageSchema = {
    body:joi.object({
      content: generalFileds.content.required()
    }),
    params:joi.object({
        receiverId: generalFileds.receiverId
     })

}

export const toggleReadSchema = {
    params:joi.object({
        messageId:generalFileds.messageId
    })
}
export const toggleFavotiteSchema = {
    params:joi.object({
        messageId:generalFileds.messageId
    })
}