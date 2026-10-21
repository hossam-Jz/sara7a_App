import { createClient, RedisClient } from "redis";
import { REDIS_URL } from "../../config/config.service.js";
import chalk from "chalk";

export const readisClient = createClient({
    url:REDIS_URL,
});


export const redisConnection = async ()=>{
    try {

       await  readisClient.connect();
       console.log(chalk.bgGreen("redis Connected successfuly"));
       
    
    } catch (error) {
        console.error("redis connection error",error)
    }
}