import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema ({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    game: { type: Number, default: 3 },
    createdAt: { type: Date, default: Date.now },
})

export default mongoose.model('User', UserSchema);
