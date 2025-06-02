import mongoose, { Schema, Types } from "mongoose";

const eventSchema = new Schema(
  {
    cid: { type: Types.ObjectId, required: true },
    eventType: { type: String }, // e.g., "page_view", "cta_click"
    eventValue: { type: String }, // e.g., "homepage", "signup_button"
    page: { type: String },
    ctaClicked: { type: String },
    meta: { type: Schema.Types.Mixed },
    email: { type: String },
    fingerprint: { type: String, index: true, sparse: true },
  },
  { timestamps: true },
);

export const Event = mongoose.model("Event", eventSchema);
