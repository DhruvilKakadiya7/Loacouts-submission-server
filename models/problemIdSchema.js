import mongoose from 'mongoose';

export const problemIdSchema = mongoose.Schema({
  difficulty: {
    type: Number,
    required: true 
  },
  Id: {
    type: String,
    required: true
  },
});

export default mongoose.model("cfproblemids",problemIdSchema);