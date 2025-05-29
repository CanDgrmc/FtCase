import DB from "./DB";
import Cache from "./cache";
import { HSymbolChart, init as initHSymbolChart } from "./models/HSymbolChart";
import { Customer, init as initCustomer } from "./models/Customer";

const modelsInit = async (db: DB) => {
  await Promise.all([initHSymbolChart(db.client), initCustomer(db.client)]);
};

export { DB, Cache, modelsInit, HSymbolChart, Customer };
