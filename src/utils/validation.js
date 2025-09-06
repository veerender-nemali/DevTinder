const validator = require('validator')

const validateSignUpData = (req) => {
    const { firstName, lastName, emailId, password } = req.body

    if (!firstName || !lastName) {
        throw new Error("Name is not valid")
    } else if (!validator.isEmail(emailId)) {
        throw new Error("Email is not valid")
    } else if (!validator.isStrongPassword(password)) {
        throw new Error("Password is not Strong")
    }
}

const validateEditProfileData = (req) => {
    const allowedUpdateFields = ["firstName", "lastName", "about", "skills", "photoUrl", "gender"]
    const fields = req.body

    const isUpdateAllowed = Object.keys(fields).every(field => allowedUpdateFields.includes(field))

    if (!isUpdateAllowed) {
        throw new Error("Update not allowed")
    }
}

module.exports = { validateSignUpData, validateEditProfileData }