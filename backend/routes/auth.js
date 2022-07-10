import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Joi from "@hapi/joi";

const router = express.Router();

const registerSchema = Joi.object({
  fname: Joi.string().min(3).required(),
  lname: Joi.string().min(3).required(),
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required(),
});

router.get("/", (req, res) => {
  res.send("hello auth route reached");
});

router.post("/register", async (req, res) => {
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).send("email paile nai register vako raixa");
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const { error } = await registerSchema.validateAsync(req.body);
    if (error) return res.status(400).send(error);
    const saveUser = await user.save();
    res.status(200).json(saveUser);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("credentials milena yr");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("password milena yr");
  try {
    const { error } = loginSchema.validateAsync(req.body);
    if (error) return res.status(400).send(error);
    const token = jwt.sign({ _id: user._id, email: user.email }, "nitu");
    res.header("auth-token", token).json(token);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

export default router;
