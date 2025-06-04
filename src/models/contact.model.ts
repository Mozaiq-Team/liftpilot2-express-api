import mongoose, { Schema, Types } from "mongoose";

const contactSchema = new Schema(
  {
    // Main fields
    cid: { type: String, index: true, sparse: true }, // Contact ID
    aid: { type: String, index: true, required: true }, // Account ID (replaces accountId)
    emails: { type: [String], required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    lastPageVisited: String,
    actions: [String],
    lastAction: String,
    fingerprint: { type: String, index: true, sparse: true },
    anon: { type: Boolean, default: false }, // Anonymous contact flag

    // Nested fields used in seed.js
    dynamic: {
      lastPage: String,
      lastAction: String,
      lastDemoNotes: String,
    },
  },
  { timestamps: true },
);

export const Contact = mongoose.model("Contact", contactSchema);
