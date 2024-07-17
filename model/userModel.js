import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pic: {
    type: String,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  phoneno: { type: String },
  address: { type: String },
  createAt: { type: Date, default: Date.now },
  gender: { type: String },
  isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);
export default User;
