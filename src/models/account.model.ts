import mongoose, { Schema, Types } from "mongoose";

const AccountSchema = new Schema(
  {
    aid: { type: String, index: true, sparse: true }, // Field used in seed.js
    accountName: { type: String, required: true },
    industry: { type: String, required: true },
    sizeEE: { type: String },
    sizeRev: { type: String },
    rep: { type: String },
    company_ip: { type: String, index: true, sparse: true },
    dynamic: {
        type: Map,
        of: Schema.Types.Mixed,
        default: {},
    },
    contacts: [{ type: Types.ObjectId, ref: "Contact" }],
  },
  { timestamps: true },
);

export const Account = mongoose.model("Account", AccountSchema);
