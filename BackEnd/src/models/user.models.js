import mongoose, { Schema } from 'mongoose'
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar: {
        type: String,
        required: true,
        default: process.env.DEFAULT_AVATAR
    },
    watchHistory: [{
        type: Schema.Types.ObjectId,
        ref: "video"
    }],

    recentSearches: [{
        type: String,
        trim: true
    }],
    socialMdiaLink: {
        type: Object
    },
    draftVideo: {
        type: String
    },
    bio: {
        type: String,
        default: "Hey I'm Using Playsync"
    },
    isHistorySaved: {
        type: Boolean,
        default: true
    },
    theme: {
        type: String,
        default: "dark"
    },
    password: {
        type: String,
        required: [true, 'Password is required'],

    },
    refreshToken: {
        type: String,

    }

}, { timestamps: true })

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this._id,
        name: this.name,
        fullName: this.fullName,
        email: this.email,

    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPAIRY
        }

    )
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({
        _id: this._id
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPAIRY
        }

    )
}
export const User = mongoose.model("User", userSchema)