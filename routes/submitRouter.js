import express from 'express';
import submissionManager from '../utils/submissionManager.js';
import submissionModel from '../models/submissionsSchema.js';
import subModel from '../models/subSchema.js'
import Scrapper from '../utils/scrapper.js';
import { MongoClient, ObjectId } from 'mongodb';

const submitRouter = express.Router();

submitRouter.get('/getDuelSubmissions/:id', async (req, res)=>{
    const id = req.params.id;
    const ok = await submissionModel
    .findOne({duelId: id})
    .populate('submissions')
    .exec()
    if(ok) {
        res.status(200).json(ok);
    }
    else {
        let xx = [];
        res.status(200).json([]);
    }
})

submitRouter.post('/submitProblem', submissionManager.submissionHelper)

submitRouter.get('/getSubmissionData/:id', async (req, res) => {
    try {
        const submissionId = req.params.id;
        let subData = await subModel.findById(submissionId);
        let verdict = await Scrapper.getVerdict(subData.submissionId, subData.contestId);
        await subModel.findOneAndUpdate(
            {
                _id: new ObjectId(submissionId),
            },
            {
                $set: {
                    status: verdict,
                }
            }
        );
        res.status(200).json({
            verdict, 
            submissionTime: subData.submissionTime 
        });
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: e });
    }
})

export default submitRouter;