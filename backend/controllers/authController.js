const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (user && (await user.matchPassword(password))) {
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });
    res.json({ token });
  } else {
    res.status(401).json({ message: "Invalid credentials" });
  }
};

const signUp = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.create({ email, password });
    res.status(200).json({ message: "User created Successfuly.", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
      error,
    });
  }
};

module.exports = { login, signUp };
