import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true
  },
  passwordHash: {
    type: String,
    default: ""
  },
  googleId: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: ""
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

export default mongoose.model("User", userSchema);