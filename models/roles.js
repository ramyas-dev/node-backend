import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.User, { foreignKey: 'role', as: 'users' });
    }
  }

  Role.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'roles',
    }
  );

  return Role;
};
