const express = require("express")
const profileRouter = express.Router()

const { userAuth } = require("../middlewares/auth.js")
const { validateEditProfileData } = require("../utils/validation.js")

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    try {
        const user = req.user

        res.send(user)
    } catch (error) {
        res.status(400).send("Error : " + error.message)
    }
})

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    try {
        validateEditProfileData(req)

        const loggedInUser = req.user

        Object.keys(req.body).forEach(key => {
            loggedInUser[key] = req.body[key]
        })

        await loggedInUser.save()

        res.send({
            message: `${loggedInUser.firstName}, your profile updated successfully`,
            data: loggedInUser
        })

    } catch (error) {
        res.status(400).send("Error : " + error.message)

    }
})

module.exports = profileRouter