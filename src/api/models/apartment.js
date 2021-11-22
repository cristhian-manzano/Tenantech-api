module.exports = (sequelize, DataTypes) => {
  const Apartment = sequelize.define(
    "Apartment",
    {
      code: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },

      width: {
        type: DataTypes.DECIMAL(7, 2),
        allowNull: true,
      },

      length: {
        type: DataTypes.DECIMAL(7, 2),
        allowNull: true,
      },

      floor: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      monthlyPrice: {
        type: DataTypes.DECIMAL(8, 2),
        allowNull: false,
      },

      bedroomCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      bathroomCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      kitchenCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      available: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },

      lightMeter: {
        type: DataTypes.STRING(50),
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
  };


  return Apartment;
};
