const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    f_name: {
      type: String,
      required: true,
    },
    l_name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    pwd: {
      type: String,
      select: false,
    },
    otp: {
      type: Number,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
    status: {
      type: Number,
      enum: [0, 1], // 0: offline, 1: online
      default: 0,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

const User = mongoose.model("user", userSchema);
module.exports = User;
