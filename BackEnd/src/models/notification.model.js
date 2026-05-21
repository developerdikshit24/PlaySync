import mongoose, { Schema } from "mongoose";

const notificationSchema = new Schema({
  uploader: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  media: {
    type: Object,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;