// models/contactRequest.model.js
import mongoose from "mongoose";

const contactRequestSchema = new mongoose.Schema(
    {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        status: { type: String, enum: ["pending", "accepted"], default: "pending" },
    },
    { timestamps: true }
);

export default mongoose.model("ContactRequest", contactRequestSchema);
