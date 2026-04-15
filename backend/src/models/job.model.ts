import { DataTypes, Model } from "sequelize";
import sequelize from "../db/sequelize";

export class Job extends Model {}

Job.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    external_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    metadata: DataTypes.JSONB,
    started_at: DataTypes.DATE,
    finished_at: DataTypes.DATE,
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
    tableName: "jobs",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["external_id", "source"],
      },
    ],
  }
);
