import config from "config";
import { dbConfig } from "@interfaces/db.interface";

const { host, port, database, username, password }: dbConfig =
  config.get("dbConfig");

export const dbConnection = {
  url: process.env.MONGO_URL,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  },
};
