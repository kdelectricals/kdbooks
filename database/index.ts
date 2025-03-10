import sequelize from "./config";
import Customer from "./models/Customer";
import Invoice from "./models/Invoice";
import Item from "./models/Item";
import User from "./models/User";

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
    await sequelize.sync({ alter: true });
    console.log("All models synced!");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

export default syncDatabase;
