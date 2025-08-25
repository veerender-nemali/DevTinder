const mongoose = require("mongoose");
const validator = require("validator")

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

const User = mongoose.model("User", userSchema);

module.exports = User;
