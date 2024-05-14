import mongoose from "mongoose";

const { Schema } = mongoose;

const PastrySchema = new Schema ({
    name: { type: String, required: true },
    number: { type: Number, required: true },
    order: { type: Number, required: true }
})

export default mongoose.model('Pastry', PastrySchema);
