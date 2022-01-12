import clearDatabaseTables from "./clear-database";
import log from "loglevel";
import path from "path";

log.setDefaultLevel("info");

const outputs = path.resolve(__dirname, "..", "backend-outputs.json");
clearDatabaseTables(outputs);
