import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : { type: String, required: true },
    email : { type: String, required: true, unique: true },
    password : { type: String, required: true },
    cartData : { type: Object, default: {} },
    loginAttempts: { type: Number, default: 0 }, // Tracks failed login attempts
    lockUntil: { type: Date, default: null },   // Timestamp for account lock

}, {minimize: false});

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;