import mongoose, { Schema } from "mongoose";

const eventSchema = new Schema(
  {
    cid: { type: String, index: true, sparse: true },
    name: { type: String },
    value: { type: Schema.Types.Mixed },
  },
  { timestamps: true },
);

export const Event = mongoose.model("Event", eventSchema);
