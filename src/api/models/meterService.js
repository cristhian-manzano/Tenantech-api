module.exports = (sequelize, DataTypes) => {
  const MeterService = sequelize.define(
    "MeterService",
    {
      lightMeter: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
      waterMeter: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },
    },
    {
      tableName: "MeterServices",
      timestamps: false,
    }
  );

  // MeterService.associate = (model) => {};

  return MeterService;
};
