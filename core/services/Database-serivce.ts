import { AstraDB } from "@datastax/astra-db-ts";

export class DatabaseService {
  private static _instance = new DatabaseService();
  public astraDb: AstraDB;

  constructor() {
    if (DatabaseService._instance) {
      throw new Error(
        "Error: Instantiation failed: Use SingletonClass.getInstance() instead of new."
      );
    }
    DatabaseService._instance = this;

    this.astraDb = new AstraDB(
      process.env.DATABASE_TOKEN,
      process.env.DATABASE_URL
    );
  }

  public static get instance(): DatabaseService {
    if (!DatabaseService._instance) {
      DatabaseService._instance = new DatabaseService();
    }
    return DatabaseService._instance;
  }
}
