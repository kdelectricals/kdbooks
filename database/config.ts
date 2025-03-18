import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
  "u289886573_kdbook",
  "u289886573_root",
  "KDsales@123",
  {
    host: "streetfoodwala.in",
    dialect: "mysql",
    dialectModule: require('mysql2'),
    logging: false, // Disable logging in production
  }
);

export default sequelize;
