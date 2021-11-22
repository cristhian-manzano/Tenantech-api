const { User, Role } = require("../models/");

const get = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { id: 3 },
      include: { model: Role, as: "role" },
    });

    // const role = await user.getRole();

    return res.status(200).json({ user });
  } catch (e) {
    console.log(e.message);
    return res.status(400).json({ error: "Error server" });
  }
};

module.exports = {
  get,
};
