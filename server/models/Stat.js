import mongoose from "mongoose";

const { Schema } = mongoose;

const StatSchema = new Schema ({
    username: { type: String, required: true },
    pastries: { type: String, required: true },
    winAT: { type: Date, default: Date.now },
})

export default mongoose.model('Stat', StatSchema);
