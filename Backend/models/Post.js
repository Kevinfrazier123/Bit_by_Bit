import mongoose from "mongoose";

const PostSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
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
    likes: { type: [String], default: [] }, // store userIds who liked
    comments: [
      {
        userId: String,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Post", PostSchema);
