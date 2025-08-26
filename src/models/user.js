const mongoose = require("mongoose");
const validator = require("validator")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const userSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
            minLength: 4,
            maxLength: 50
        },
        lastName: {
            type: String,
            minLength: 4,
            maxLength: 50
        },
        password: {
            type: String,
            validate(val) {
                if (!validator.isStrongPassword(val)) {
                    throw new Error("password is not strong : " + value)
                }
            }
        },
        age: {
            type: Number,
            required: true,
            min: 18
        },
        emailId: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            validate(val) {
                if (!validator.isEmail(val)) {
                    throw new Error("Invalid email Id : " + value)
                }
            }
        },
        gender: {
            type: String,
            required: true,
            //this validate method only runs when a new document is created not when there is already a document present
            validate(val) {
                if (!["male", "female", "others"].includes(val)) {
                    throw new Error("Gender data is not valid")
                }
            }
        },
        photoUrl: {
            type: String,
            default: "https://veerimg.com",
            validate(val) {
                if (!validator.isURL(val)) {
                    throw new Error("Invalid Url Id : " + value)
                }
            }
        },
        about: {
            type: String,
            default: "This is about default user"
        },
        skills: {
            type: [String],
            max: 10
        }
    },
    {
        timestamps: true,
    }
);

userSchema.methods.getJWT = async function () {
    const user = this

    const token = await jwt.sign({ _id: user._id }, "DEVTinder2001@$", { expiresIn: "7d" })

    return token
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this
    const passwordHash = user.password

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash)

    return isPasswordValid
}

const User = mongoose.model("User", userSchema);

module.exports = User;
