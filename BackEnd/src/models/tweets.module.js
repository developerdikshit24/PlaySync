import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        require: true,
        trim:true
    },
    description: {
        type: String,
        require: true,
        trim:true
    },
    media: {
        type: String
    }
}, { timestamps: true })

export const Tweet = mongoose.model("Tweet", tweetSchema)