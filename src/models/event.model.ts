import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    cid: { type: String, index: true, sparse: true }, // e.g., "12345"
    eventName: { type: String }, // e.g., "page_view", "cta_click"
    eventType: { type: String }, // e.g., "click"
    eventData: { type: Schema.Types.Mixed }, // e.g., { "buttonId": "cta-123" }
    page: { type: String },
    ctaClicked: { type: String },
    email: { type: String },
    fingerprint: { type: String, index: true, sparse: true },
  },
  { timestamps: true },
);

export const Event = mongoose.model("Event", eventSchema);
