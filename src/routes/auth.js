const express = require("express")
const authRouter = express.Router()

const { validateSignUpData } = require("../utils/validation")
const bcrypt = require("bcrypt")
const User = require("../models/user")

//storing data in DB from user
authRouter.post("/signup", async (req, res) => {
    try {
        //validation
        validateSignUpData(req)

        const { firstName, lastName, emailId, password, gender, age } = req.body

        //encrypting password
        const passwordHash = await bcrypt.hash(password, 10)

        //creating a new instance of a user model
        const user = new User({ firstName, lastName, emailId, password: passwordHash, gender, age }) //req.body => has js object


        await user.save()
        res.send("User data saved successfully")
    } catch (err) {
        res.status(400).send("Error : " + err.message)
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body

        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid credentials")
        }

        const isPasswordValid = await user.validatePassword(password) //validatePassword() comes from user.js

        if (isPasswordValid) {
            //creating a JWT token  
            const token = await user.getJWT() //this getJWT() comes from user.js file

            res.cookie("token", token, { expires: new Date(Date.now() + 8 * 3600000) })
            res.send("Login successful!")
        } else {
            throw new Error("Invalid credentials")
        }
    } catch (error) {
        res.status(400).send("Error : " + error.message)
    }
})

authRouter.post("/logout", async (req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logout Successful!")
})

module.exports = authRouter