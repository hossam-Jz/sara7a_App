
import { readisClient } from "./redis.connection.js";


export const revokeTokenKeyPrefix =  ({userId})=>{
    return `user:revokeToken:${userId}`;
};


export const revokeTokenKey = ({userId,jti})=>{
    return `${revokeTokenKeyPrefix({userId})}:${jti}`;
};

export const set = async ({Key,Value,ttl=null})=>{
    try {
        const data = typeof Value != "string" ? JSON.stringify(Value):Value;
        if(ttl){
            return await readisClient.set(Key,data,{
                EX: ttl 
            });
        }else{
            return await readisClient.set(Key,data)
        }
    } catch (error) {
        console.error("redis set Error",error);
    }
};

export const get = async ({Key})=>{
    try {
         const data = await readisClient.get(Key);
         return data ;
    } catch (error) {
       console.error("redis get Error",error)
    }
};
// update يعني تعدل قيمته
export const update = async ({Key,Value,ttl=null})=>{
    try {
        const isExists = await readisClient.exists(Key);
        if(!isExists) return false;
       const data = typeof Value != "string" ? JSON.stringify(Value):Value;
        if(ttl){
            return await readisClient.set(Key,data,{
                 EX: ttl 
            });
        }else{
            return await readisClient.set(Key,data)
        }
    } catch (error) {
         console.error("redis Update Error",error);
    }
};
 
export const del = async ({Key})=>{
    try {
      
        return await readisClient.del(Key)
    } catch (error) {
         console.error("redis Del Error",error);
    }
};

export const expire = async ({Key,ttl})=>{
    try {
         
        return await readisClient.expire(Key,ttl);
    } catch (error) {
         console.error("redis Expire Error",error);
    }
};

export const ttl = async ({Key})=>{
    try {
       
        return await readisClient.ttl(Key);
    } catch (error) {
         console.error("redis Expire Error",error);
    }
};

export const Keys = async ({pattern})=>{
    try {
        return await  readisClient.keys(pattern);
    } catch (error) {
        console.error("redis Keys Error",error);
    }
};