const { encryptData } = require("../utils/functions");

const encryptUserPassword = async (user) => {
  if (user.changed("password")) {
    user.password = await encryptData(user.password);
  }
};

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      email: {
        type: DataTypes.STRING(75),
        allowNull: false,
        unique: true,
      },

      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },

      idNumber: {
        type: DataTypes.STRING(25),
        allowNull: false,
        unique: true,
      },

      firstName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      lastName: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },

      phone: {
        type: DataTypes.STRING(25),
        allowNull: true,
      },

      details: {
        type: DataTypes.JSONB(),
        default: {},
        allowNull: true,
      },
    },
    {
      tableName: "Users",
    }
  );

  User.associate = (model) => {
    User.belongsTo(model.Role, { foreignKey: "idRole", as: "role" });
  };

  User.beforeCreate(encryptUserPassword);
  User.beforeUpdate(encryptUserPassword);

  return User;
};
