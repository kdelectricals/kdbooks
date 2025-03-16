import { DataTypes, Model } from "sequelize";
import sequelize from "../config";
import Quotation from "./Quotation";
import Recording from "./Recording";
import Users from "./User";

class Customer extends Model {
  [x: string]: null;
}

Customer.init(
  {
    customerID: { 
      type: DataTypes.INTEGER, 
      autoIncrement: true, 
      primaryKey: true 
    },
    first_name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    last_name: { 
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
    company_name: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    address: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    requirement: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    remark: { 
      type: DataTypes.STRING, 
      allowNull: true 
    },
    follow_up_date: { 
      type: DataTypes.DATE, 
      allowNull: true 
    },
    status: { 
      type: DataTypes.ENUM('NotCompleted','Pending','Completed'), 
      allowNull: true 
    },
    user_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
  },
  { 
    sequelize, 
    modelName: "Customer",
    tableName: "Customers", // Explicitly define the table name
    timestamps: false, // If you don't have createdAt/updatedAt columns
  }
);

// / Define relations÷hips
Customer.hasMany(Quotation, { foreignKey: "customer_id", as: "quotations" });
Customer.hasMany(Recording, { foreignKey: "CustomerID", as: "recordings" });

(async () => {
  const Users = (await import("./User")).default;
  Customer.belongsTo(Users, { foreignKey: "user_id", as: "users" });
})();
export default Customer;
