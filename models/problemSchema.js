import mongoose from 'mongoose';

export const problemSchema = mongoose.Schema({
  contestId: {
    type: Number,
    required: true 
  },
  index: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    default: "PROGRAMMING"
  },
  points: {
    type: Number
  },
  tags: {
    type: [{
      type: String
    }],
    required: false
  },
  content: {
    type: {},
    required: true
  }
});

export default mongoose.model("CFProblem",problemSchema);