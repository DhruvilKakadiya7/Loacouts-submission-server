import mongoose from "mongoose";

export const userSchema = mongoose.Schema({
    handle: {
        type: String,
        required: true,
        default: "Guest",
    },
    uid: {
        type: String,
        required: true,
    },
    currentDuelId: {
        type: String,
        default: '',
    }
});

export default mongoose.model("users",userSchema);