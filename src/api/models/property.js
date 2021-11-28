module.exports = (sequelize, DataTypes) => {
  const Property = sequelize.define(
    "Property",
    {
      name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      apartmentsNumber: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      totalFloors: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      zipCode: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },

      idCanton: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Canton",
          key: "id",
        },
      },

      idOwner: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },

      idMeterServices: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "MeterService",
          key: "id",
        },
      },
    },
    {
      tableName: "Properties",
      timestamps: false,
    }
  );

  Property.associate = (model) => {
    Property.belongsTo(model.MeterService, {
      foreignKey: "idMeterServices",
      as: "meterServices",
    });
  };

  return Property;
};
