import{TooManyRequestException} from "../Utils/respones/err.respones.js";

const ipRequest = {};

const blockedIps = new Set();

const unBlockresTimer = new Map();

const Rate_Limit = 10;
const Windows_Ms = 2* 60 * 1000;


export const customRateLimiter = ()=>{
    return (req,res,next)=>{ 
        const ip = req.ip;
       

        const currentTime = Date.now()
        if(blockedIps.has(ip)) throw TooManyRequestException({message:"Too Many Requests, please try again Later "});

        if(!ipRequest[ip]){
            ipRequest[ip] = {
                count:1,
                startTime:currentTime
            }
            return next()
        }
        const diff = currentTime-ipRequest[ip].startTime;
        if(diff < Windows_Ms){
            ipRequest[ip].count++;

            if(ipRequest[ip].count> Rate_Limit){
                blockedIps.add(ip)
                if(!unBlockresTimer.has(ip)){
                    const timer = setTimeout(()=>{
                        blockedIps.delete(ip);
                        unBlockresTimer.delete(ip);
                    },Windows_Ms);
                    unBlockresTimer.set(ip,timer)
                }
                throw TooManyRequestException({message:"Too Many Requests, please try again Later"})
            }
        }
        else{
            ipRequest[ip] = {
                count:1,
                startTime:currentTime
            }
        }
        next();
    }
}


// express-rate-limit مكتبه 