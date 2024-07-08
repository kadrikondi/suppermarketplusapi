import mongoose from "mongoose";

const supermarketSchema = new mongoose.Schema({
  name: { type: String },
  phone: { type: String },
  email: { type: String },
  street: { type: String },
  city: { type: String },
  building: { type: String },
  state: { type: String },
  whatsappno: { type: String },
  images: [{ type: String }], // Array of image URLs
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "review" }], // Reference to the review model
  postBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, // Reference to the user who created the supermarket
  dateCreated: { type: Date, default: Date.now() },
  verified: { type: Boolean, default: false },
});

const Supermarket = mongoose.model("Supermarket", supermarketSchema);
export default Supermarket;
