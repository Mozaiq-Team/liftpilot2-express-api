import mongoose, { Schema, Types } from "mongoose";

const AccountSchema = new Schema(
  {
    accountName: { type: String, required: true },
    industry: { type: String, required: true },
    sizeEE: { type: String },
    sizeRev: { type: String },
    rep: { type: String },
    company_ip: { type: String, index: true, sparse: true },
    dynamic: {
      opportunity: String,
    },
    contacts: [{ type: Types.ObjectId, ref: "Contact" }],
  },
  { timestamps: true },
);

export const Account = mongoose.model("Account", AccountSchema);
