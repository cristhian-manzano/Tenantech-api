module.exports = (sequelize, DataTypes) => {
  const Observation = sequelize.define(
    "Observation",
    {
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      date: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      solved: {
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

      idUser: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
      },
    },
    {
      tableName: "Observations",
      timestamps: false,
    }
  );

  Observation.associate = (model) => {
    Observation.belongsTo(model.Rent, {
      foreignKey: "idRent",
      as: "rent",
    });

    Observation.belongsTo(model.User, {
      foreignKey: "idUser",
      as: "user",
    });
  };

  return Observation;
};
