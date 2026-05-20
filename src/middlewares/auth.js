const jwt = require("jsonwebtoken")
const User = require('../models/user')

const userAuth = async (req, res, next) => {
    try {
        const cookies = req.cookies
        const { token } = cookies
        if (!token) {
            return res.status(401).send("Please login!")
        }

        const jwtSecret = process.env.JWT_SECRET
        if (!jwtSecret) {
            throw new Error("JWT secret is not configured")
        }

        const decodedMessage = await jwt.verify(token, jwtSecret)

        const { _id } = decodedMessage

        const user = await User.findById(_id)
        if (!user) {
            throw new Error("user not found!")
        }

        req.user = user
        next()

    } catch (error) {
        res.status(400).send("Error : " + error.message)
    }

}

module.exports = { userAuth }