import mongoose from "mongoose";
const debugModel = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    code: {
        type: String,
        required: true,
    },
    IncorrectCode: {
        type: String,
        required: true,
    },
    issues: {
        type: [String],
        default: [],
    },
    fixes: {
        type: [String],
        default: [],
    },
    explanation: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
})
export default mongoose.model("debugData", debugModel)