import fs from "node:fs";
import path from "node:path";
import morgan  from "morgan";

const __dirman = path.resolve();



export function attachRouterWithLogger (app,routerPath,router,logFilename){
    const logStream = fs.createWriteStream(
        path.resolve(__dirman,"./src/loggers",logFilename),
        {flags:"a"}, //معناه Append، يعني يضيف البيانات الجديدة في نهاية الملف بدل ما يمسح البيانات القديمة.
    );

  app.use(
  routerPath,
  morgan("combined", { stream: logStream }),  // الملف
  morgan("dev"),                               // الـ console
  router,
);
}