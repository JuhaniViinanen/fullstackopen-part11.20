const User = require("../models/user")
const jwt = require("jsonwebtoken")
const logger = require("./logger")

const requestLogger = (req, res, next) => {
    logger.info(req.method, req.path, req.body)
    next()
}

const unknownEndpoint = (req, res) => {
    res.status(404).json({ error: "unknown endpoint" })
}

const tokenExtractor = (req, res, next) => {
    const auth = req.get("authorization")
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
        req.token = auth.substring(7)
    } else {
        req.token = null
    }
    next()
}

const userExtractor = async (req, res, next) => {
    try{
        const decodedToken = jwt.verify(req.token, process.env.SECRET)
        if (!decodedToken.id) return res.status(401).json({ error: "invalid token" })
        req.user = await User.findById(decodedToken.id)
        next()
    } catch(error) {
        next(error)
    }
}

const errorHandler = (error, req, res, next) => {
    logger.error(error.message)

    if (error.name === "CastError") {
        return res.status(400).json({ error: error.message })
    } else if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message })
    } else if (error.name === "JsonWebTokenError") {
        return res.status(401).json({ error: error.message })
    }

    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    tokenExtractor,
    userExtractor,
    errorHandler
}
