import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    cid: { type: String, index: true, sparse: true }, // Contact ID, e.g., "12345"
    name: { type: String }, // Event name, e.g., "page_view", "cta_click" (replaces eventName)
    value: { type: Schema.Types.Mixed }, // Event data, e.g., { "buttonId": "cta-123" } (replaces eventData)
    fingerprint: { type: String, index: true, sparse: true }
  },
  { timestamps: true },
);

export const Event = mongoose.model("Event", eventSchema);
