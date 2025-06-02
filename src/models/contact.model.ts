import mongoose, { Schema, Types } from "mongoose";

const contactSchema = new Schema(
  {
    accountId: { type: Types.ObjectId, ref: "Account", required: true },
    emails: { type: [String], required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    lastPageVisited: String,
    actions: [String],
    lastAction: String,
    fingerprint: { type: String, index: true, sparse: true },
  },
  { timestamps: true },
);

export const Contact = mongoose.model("Contact", contactSchema);
