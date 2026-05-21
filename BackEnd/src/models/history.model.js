import mongoose, { Schema } from "mongoose";

const historySchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    videos: [{
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }],
    tweets: [{
        type: Schema.Types.ObjectId,
        ref: 'Tweet'
    }]
}, { timestamps: true })

export const History = mongoose.model('History', historySchema)