'use strict';
import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class FileMaster extends Model {
    static associate(models) {
      FileMaster.belongsTo(models.User, { foreignKey: "uploaded_by", as: "uploader" });
      models.User.hasMany(FileMaster, { foreignKey: "uploaded_by", as: "filesUploaded" });
    }
  }

  FileMaster.init(
    {
      filename: DataTypes.STRING,
      file_path: DataTypes.STRING,
      uploaded_by: DataTypes.INTEGER,
      records_count: DataTypes.INTEGER,
      status: DataTypes.STRING,
      upload_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "FileMaster",
      tableName: "file_master",
      timestamps: false,
    }
  );

  return FileMaster;
};
