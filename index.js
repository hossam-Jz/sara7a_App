import express from "express";
import { PORT } from "./src/config/config.service.js";
import { bootstrap } from "./app.controler.js";
import chalk  from "chalk";
const app = express();

const port = PORT;

await bootstrap(app, express);
app.listen(port, () => {
  console.log(chalk.blue.bold(`Server is running on http://localhost:${port}`));
});
