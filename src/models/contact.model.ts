import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db.config";

export interface ContactAttributes {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export class Contact
  extends Model<ContactAttributes>
  implements ContactAttributes
{
  declare id: string;
  declare name: string;
  declare email: string;
  declare phone?: string;
  declare message: string;
}

Contact.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false,
    },
    phone: {
      type: DataTypes.STRING,
    },
    message: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "contacts",
    timestamps: true,
  }
);
