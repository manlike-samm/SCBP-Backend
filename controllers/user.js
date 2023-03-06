import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";

const secret = "test";

export const signin = async (req, res) => {
  const { username, password } = req.body;
  console.log(password);
  try {
    const oldUser = await UserModal.findOne({ username });

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    // const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (password !== oldUser.password)
      return res.status(400).json({ message: "Password not correct" });

    const token = jwt.sign(
      { username: oldUser.username, id: oldUser._id },
      secret,
      { expiresIn: "1h" }
    );

    res
      .status(200)
      .json({ _id: oldUser._id, username: oldUser.username, token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signup = async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  try {
    const oldUser = await UserModal.findOne({ username });

    if (oldUser)
      return res.status(400).json({ message: "User already exists" });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords don't match" });

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await UserModal.create({
      username,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { username: result.username, id: result._id },
      secret,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });

    console.log(error);
  }
};
