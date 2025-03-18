import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  process.env.DATABASE_NAME as string,
  process.env.DATABASE_USER as string,
  process.env.DATABASE_PASSWORD as string,
  {
    host: process.env.DATABASE_HOST,
    dialect: process.env.DATABASE_DIALECT as any, // Ensure it's recognized as MySQL
    logging: false, // Disable logging in production
  }
);

export default sequelize;
