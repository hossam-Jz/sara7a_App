import { glopalHandelError } from "./src/Utils/respones/err.respones.js";
import { authRouter, messageRouter, userRouter } from "./src/Modules/index.js";
import { connectDB } from "./src/DB/Models/connection.js";
import cors from "cors";
import path from "node:path";
import { corsOption } from "./src/Utils/token/cors/cors.utils.js";
import helmet from "helmet";
import { attachRouterWithLogger } from "./src/Utils/loggers/morgan.loggers.js";
import { customRateLimiter } from "./src/Middlewares/rate-limit-middleware.js";
import { redisConnection } from "./src/DB/Models/redis.connection.js";

// import{rateLimit} from "express-rate-limit"

// const limiter = rateLimit({
// windowMs: 2 * 60 * 1000, // 2 minutes
// limit: 3, // Limit each IP to 3 requests per `window` (here, per 15 minutes).
// standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
// legacyHeaders: true, // Disable the `X-RateLimit-*` headers.
// })

export const bootstrap = async (app, express) => {
  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(cors(corsOption()));
  app.use(express.json());
  // app.use(limiter);
  app.use(customRateLimiter());
  await connectDB();
  await redisConnection();
  attachRouterWithLogger(app, "/api/auth", authRouter, "auth.log");
  attachRouterWithLogger(app, "/api/user", userRouter, "user.log");
  attachRouterWithLogger(app, "/api/message", messageRouter, "message.log");
  app.use("/uploads", express.static(path.resolve("./src/uploads")));

  app.use(glopalHandelError);
};
