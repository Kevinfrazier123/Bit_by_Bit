import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, required: true, trim: true },
    scamType: {
      type: String,
      enum: [
        "Phishing",
        "Smishing",
        "Investment",
        "Romance",
        "Tech‑Support",
        "Other",
      ],
      default: "Other",
    },
    hashtags: { type: [String], default: [] },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        text: String,
        createdAt: { type: Date, default: Date.now },
        replies: [
            {
              userId: String,
              text: String,
              createdAt: { type: Date, default: Date.now },
            }
          ],

      },
    ],
    image: { type: String, default: null },
    attachment: { type: String, default: null },

    // —— NEW RISK FIELDS —— 
    riskLevel:  { type: Number, min: 1, max: 5, default: 1 },
    riskScores: {
      keywords:   { type: Number, default: 0 },
      urls:       { type: Number, default: 0 },
      moneyAsk:   { type: Number, default: 0 },
      userTrust:  { type: Number, default: 0 },
      feedback:   { type: Number, default: 0 },
      sentiment:  { type: Number, default: 0 },
    },
  },
  { timestamps: true }
  
);

export default mongoose.model("Post", PostSchema);
