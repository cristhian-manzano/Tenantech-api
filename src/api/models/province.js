module.exports = (sequelize, DataTypes) => {
  const Province = sequelize.define(
    "Province",
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
    },
    {
      tableName: "Provinces",
      modelName: "Province",
      timestamps: false,
    }
  );

  Province.associate = (model) => {};

  return Province;
};
