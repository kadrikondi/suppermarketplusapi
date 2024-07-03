import mongoose from "mongoose";

const supermarketSchema = new mongoose.Schema({
  name: { type: String },
});

const Supermarket = mongoose.model("Supermarket", supermarketSchema);
export default Supermarket;
