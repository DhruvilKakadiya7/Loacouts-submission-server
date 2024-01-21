import mongoose, { mongo } from 'mongoose';
import {duelProblemSchema} from './duelProblemSchema.js';
import {userSchema} from './userSchema.js';
export const duelSchema = mongoose.Schema({
    players: {
        type: [userSchema],
        required: true,
        default: []
    },
    playerReady: {
        type: [],
        required: true,
        default: [false, false]
    }, 
    problems: {
        type: [duelProblemSchema],
        required: true, 
        default: []
    },
    ratingMin: {
        type: Number,
        required: true
    },
    ratingMax: {
        type: Number,
        required: true
    },
    problemCount: {
        type: Number,
        required: true,
        default: 5
    },
    timeLimit: {
        type: Number,
        required: true,
        default: 30
    },
    private: {
        type: Boolean,
        required: true,
        default: false
    },
    status: {
        type: String,
        required: true,
        default: "WAITING" // READY, ONGOING, FINISHED
    },
    playerOneScore: {
        type: Number,
        required: true,
        default: 0
    },
    playerTwoScore: {
        type: Number,
        required: true,
        default: 0
    },
    playerOneSolveCount: {
        type: Number,
        required: true,
        default: 0
    },
    playerTwoSolveCpunt: {
        type: Number,
        required: true,
        default: 0
    },
    result: {
        type: [{
            type: String,
            required: true,
            default: "TIE" // DRAW, WON
        }, {
            type: String, // Player handle of the winner
            required: false,
        }],
        default: ["TIE"]

    },
    startTime: {
        type: Number,
        required: true,
        default: 0
    },
});

export default mongoose.model("duels", duelSchema);