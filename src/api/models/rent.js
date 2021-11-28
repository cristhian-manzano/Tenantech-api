module.exports = (sequelize, DataTypes) => {
  const Rent = sequelize.define(
    "Rent",
    {
      startDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      endDate: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      guaranteeDeposit: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },

      idTenant: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Tenant",
          key: "id",
        },
      },

      idApartment: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Apartment",
          key: "id",
        },
      },
    },
    {
      tableName: "Rents",
      timestamps: false,
    }
  );

  Rent.associate = (model) => {
    Rent.belongsTo(model.User, {
      foreignKey: "idTenant",
      as: "tenant",
    });

    Rent.belongsTo(model.Apartment, {
      foreignKey: "idApartment",
      as: "apartment",
    });
  };

  return Rent;
};
