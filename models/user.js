import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, { foreignKey: 'role', as: 'roleInfo' });
    }
  }

  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      gender: DataTypes.STRING,
      age: DataTypes.INTEGER,
      phone: DataTypes.STRING,
      password: DataTypes.STRING,
      message: DataTypes.TEXT,
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
    }
  );

  return User;
};
