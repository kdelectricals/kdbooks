import sequelize from "./config";


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
