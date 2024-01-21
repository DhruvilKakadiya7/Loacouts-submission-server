import mongoose from 'mongoose';
import {subSchema} from './subSchema.js';
 
export const submissionsSchema = mongoose.Schema({
    duelId: {
        type: String,
        required: true,
    },
    submissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sub-data', // Reference to the subSchema collection
    }],
});

export default mongoose.model('Submissions', submissionsSchema);