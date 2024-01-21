import mongoose from 'mongoose';

export const duelProblemSchema = mongoose.Schema({
  Id: {
    type: String,
    required: true
  },
  difficulty: {
    type: Number
  },
  playerOneAttempts: {
    type: Number,
    // required: true,
    default: 0
  },
  playerTwoAttempts: {
    type: Number,
    // required: true,
    default: 0
  },
  playerOneScore: {
    type: Number,
    // required: true,
    default: 0
  },
  playerTwoScore: {
    type: Number,
    // required: true,
    default: 0
  }
});

export default mongoose.model("duelProblems",duelProblemSchema);