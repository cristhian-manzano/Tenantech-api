module.exports = (sequelize, DataTypes) => {
  const Canton = sequelize.define(
    "Canton",
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      idProvince: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Province",
          key: "id",
        },
      },
    },
    {
      tableName: "Cantons",
      timestamps: false,
    }
  );

  Canton.associate = (model) => {};

  return Canton;
};
