module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      code: {
        primaryKey: true,
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING(75),
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  return Role;
};
