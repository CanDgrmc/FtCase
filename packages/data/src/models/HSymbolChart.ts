import type {
  InferAttributes,
  InferCreationAttributes,
  Sequelize,
} from "sequelize";
import { DataTypes, Model } from "sequelize";

const tableName = "hsymbol_chart_1m_delayed";

export class HSymbolChart extends Model<
  InferAttributes<HSymbolChart>,
  InferCreationAttributes<
    HSymbolChart,
    {
      omit: "id" | "createdAt" | "updatedAt";
    }
  >
> {
  declare id: string;
  declare symbol: string;
  declare open: number;
  declare close: number;
  declare high: number;
  declare low: number;
  declare dataTimestamp: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

export const model = HSymbolChart;
export const init = async (sequelize: Sequelize): Promise<void> => {
  HSymbolChart.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      symbol: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      open: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      close: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      high: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      low: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      dataTimestamp: {
        type: DataTypes.DATE,
        field: "data_timestamp",
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
};

export const assoc = (): void => {};
