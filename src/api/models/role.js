module.exports = (sequelize, DataTypes) => {
  const Role = sequelize.define(
    "Role",
    {
      name: {
        type: DataTypes.STRING(75),
        unique: true,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  return Role;
};
