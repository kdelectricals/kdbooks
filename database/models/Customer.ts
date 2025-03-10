import { DataTypes, Model } from "sequelize";
import sequelize from "../config";

class Customer extends Model {}

Customer.init(
  {
    customerID: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    firstName: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    lastName: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    contact: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    email: { 
      type: DataTypes.STRING, 
      allowNull: false, 
      unique: true 
    },
    companyName: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    address: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
  },
  { 
    sequelize, 
    modelName: "Customer",
    tableName: "Customers", // Explicitly define the table name
    timestamps: false, // If you don't have createdAt/updatedAt columns
  }
);

export default Customer;
