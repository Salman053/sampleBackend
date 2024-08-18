import { Schema, model, Types } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Types.ObjectId, // one whom is subscribing
      ref: "User",
      required: true,
    },
    channel: {
      type: Types.ObjectId, // one to whom subscriber is subscribing
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export const Subscription = model("Subscription", subscriptionSchema);
