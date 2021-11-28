module.exports = (sequelize, DataTypes) => {
  const Contract = sequelize.define(
    "Contract",
    {
      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      contractTerm: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      contractFile: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },

      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },

      idRent: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Rent",
          key: "id",
        },
      },
    },
    {
      tableName: "Contracts",
      timestamps: false,
    }
  );

  Contract.associate = (model) => {
    Contract.belongsTo(model.Apartment, {
      foreignKey: "idRent",
      as: "rent",
    });
  };

  return Contract;
};
