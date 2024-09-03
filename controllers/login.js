const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const loginRouter = require("express").Router()
const User = require("../models/user")

loginRouter.post("/", async (req, res) => {
    const user = await User.findOne({ username: req.body.username })
    const passCorrect = user === null ?
      false :
      await bcrypt.compare(req.body.password, user.passwordHash)
    
    if (!(user && passCorrect)) {
        return res.status(401).json({ error: "invalid username or password" })
    }

    const userForToken = {
        id: user._id,
        username: user.username
    }
    const token = jwt.sign(userForToken, process.env.SECRET)
    res.status(200).send({
        token,
        username: user.username,
        name: user.name
    })
})

module.exports = loginRouter
