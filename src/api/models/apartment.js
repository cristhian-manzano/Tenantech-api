module.exports = (sequelize, DataTypes) => {
  const Apartment = sequelize.define(
    "Apartment",
    {
      code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      width: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },

      length: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },

      floor: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      monthlyPrice: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: true,
      },

      bedroomCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      bathroomCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      kitchenCount: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      available: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },

      lightIncluded: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },

      waterIncluded: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },

      internetIncluded: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },

      furnished: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },

      idProperty: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Property",
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
      tableName: "Apartments",
      timestamps: false,
    }
  );

  Apartment.associate = (model) => {
    Apartment.belongsTo(model.Property, {
      foreignKey: "idProperty",
      as: "property",
    });

    Apartment.belongsTo(model.MeterService, {
      foreignKey: "idMeterServices",
      as: "meterServices",
    });
  };

  return Apartment;
};
