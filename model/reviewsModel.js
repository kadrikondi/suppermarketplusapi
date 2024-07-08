import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  createAt: { type: Date, default: Date.now },

  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  supermarket: { type: mongoose.Schema.Types.ObjectId, ref: "supermarket" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // Reference to the user who created the review  // Reference to the supermarket to which the review is related  // Reference to the user who created the review   // Date when the review was created  // Rating of the review  // Comments about the review  // Reference to the supermarket to which the review is related  // Reference to the user who created the review  // Date when the review was created  // Rating of the review  // Comments about the review  // Reference to the supermarket to which the review is related  // Reference to the user who created the review  // Date when the review
});

const User = mongoose.model("Review", reviewSchema);
export default User;
