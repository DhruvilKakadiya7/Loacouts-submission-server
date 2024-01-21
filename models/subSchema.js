import mongoose from 'mongoose';
 
export const subSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        default: ''
    },
    playerUid: {
        type: String,
        required: true,
    },
    submissionId: {
        type: Number,
        required: true
    },
    contestId: {
        type:Number,
        required: true
    },
    problemNumber: {
        type: String,
        required: true
    },
    languageCode: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Testing'
    },
    submissionTime: {
        type: Number,
        required: true
    }
});

export default mongoose.model('sub-data', subSchema);