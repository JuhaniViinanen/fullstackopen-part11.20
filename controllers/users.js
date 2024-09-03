const usersRouter = require("express").Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

usersRouter.get("/", async (req, res) => {
  const users = await User.find({}).populate("blogs", { title: 1, author: 1, url: 1 })
  res.json(users)
})

usersRouter.post("/", async (req, res, next) => {
  if (req.body.password === undefined || req.body.password.length < 3) {
    return res.status(400).json({ error: "password must be at least 3 characters in length" })
  }
  try {
    const passwordHash = await bcrypt.hash(req.body.password, 10)
    const user = new User({
        username: req.body.username,
        passwordHash: passwordHash,
        name: req.body.name
    })
    const savedUser = await user.save()
    res.status(201).json(savedUser)
  } catch(exception) {
    next(exception)
  }
})

module.exports = usersRouter
