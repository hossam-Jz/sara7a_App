import { EventEmitter } from "node:events";
import { emailSubject, sendMail } from "../emails/email.Utlis.js";
import { template } from "../emails/generateHTML.js";
 

export const emailEvents = new EventEmitter();


emailEvents.on("confirmEmail",async (data)=>{
   try {
         await sendMail({
        to:data.to,
        subject: emailSubject.confirmEmail,
        html:template(data.otp,data.userName,emailSubject.confirmEmail)
    })
   } catch (error) {
    console.log("Error sending Email",error);
    
   }
})
emailEvents.on("forgetPassword",async (data)=>{
   try {
         await sendMail({
        to:data.to,
        subject: emailSubject.resetPassword,
        html:template(data.otp,data.userName,emailSubject.resetPassword)
    })
   } catch (error) {
    console.log("Error sending Email",error);
    
   }
})