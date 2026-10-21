import { WHITE_LIST } from "../../../config/config.service.js"
import {BadRequestException} from "../../respones/err.respones.js"



export const corsOption = ()=>{
const whiteList = WHITE_LIST.split(",");
    const corsOptions = {
        origin:function(origin,callback){
        if(whiteList.includes(origin)){
            callback(null,true);
        }else if (!origin) {   // POSTMAN , CMD بيرجعوا ORIGIN:UNDEFIUND
            callback(null,true);
        }else{
            callback(BadRequestException({message:"not Allowed By Cors"}));
        }
    },
    methods:["GET","POST","PATCH"]
}
return corsOptions;  

}
