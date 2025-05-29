import type {
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
} from "sequelize";
import { DataTypes, Model } from "sequelize";

const tableName = "customers";

export class Customer extends Model<
  InferAttributes<Customer>,
  InferCreationAttributes<
    Customer,
    {
      omit: "id" | "createdAt" | "updatedAt";
    }
  >
> {
  declare id: string;
  declare name: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const model = Customer;
export const init = async (sequelize: Sequelize): Promise<void> => {
  Customer.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        field: "created_at",
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: "updated_at",
      },
    },
    {
      sequelize,
      tableName,
      initialAutoIncrement: "361646",
    }
  );

  await Customer.sync({ alter: true });
};

export const assoc = (): void => {};
