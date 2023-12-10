import { Database } from "sqlite";
import sqlite3 from "sqlite3";

interface AppContext {
  db: Database<sqlite3.Database, sqlite3.Statement>;
}

export const context = {} as AppContext;
