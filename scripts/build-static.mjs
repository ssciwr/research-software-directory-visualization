import fs from "fs";
import shell from "shelljs";

export function buildStatic() {
  // copy html, css, json to dist folder
  fs.mkdirSync("./dist", { recursive: true });
  shell.cp("./src/html/index.html", "./dist/.");
  shell.cp("./src/css/style.css", "./dist/.");
  shell.cp("./src/data/data.json", "./dist/.");
}
