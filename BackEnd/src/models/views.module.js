import mongoose, { Schema } from "mongoose";

const viewsSchema = new Schema({
    videos: {
        type: Schema.Types.ObjectId,
        ref: 'Video'
    }
    ,
    viewers: [{
        type: Schema.Types.ObjectId,
        ref: "User"
    }],

})

export const Views = mongoose.model('View', viewsSchema);