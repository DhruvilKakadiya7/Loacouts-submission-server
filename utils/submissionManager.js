import superagent from 'superagent';
import { CookieJar } from 'tough-cookie';
import submissionModel from '../models/submissionsSchema.js';
import subModel from '../models/subSchema.js';
import duelModel from '../models/duelSchema.js';
const agent = superagent.agent();
const cookieJar = new CookieJar();
const username = 'lockouts-bot';
const password = 'DhruvilK@123';
class submissionManager {
	static async submissionHelper(req, res) {
		const data = req.body;
		// console.log(data);
		let { codeContent, problemId, playerUid, languageCode, duelId, contestId, problemIndex } = data;

		try {
			// const duel = await this.findDuel(duelId);
			const numSpaces = Math.floor(Math.random() * 1000);
			const newCode = codeContent.padEnd(codeContent.length + numSpaces);
			// console.log(contestId, problemIndex, newCode);
			const ret = await submissionManager.submit(
				contestId,
				problemIndex,
				{
					languageCode: languageCode,
					codeContent: newCode
				}
			);
			if (ret[0]) {
				let submissionData = {
					submissionId: ret[1].submissionId,
					code: newCode.trim(),
					playerUid: playerUid,
					languageCode: languageCode,
					contestId: ret[1].contestId,
					status: 'TESTING',
					submissionTime: new Date().getTime(),
					problemNumber: data.problemId,
				}
				const newSubmission = new subModel(submissionData);
				const subData = await newSubmission.save();
				await submissionManager.addOrUpdateSubmissions(duelId, subData._id);
				res.status(201).json({
					result: true,
					dataBaseId: (subData._id.toString())
				});
			}
			else {
				res.status(201).json({ result: false });
			}
		} catch (e) {
			console.log(e);
			res.status(201).json({ result: false });
		}
	}

	static async findDuel(duelId) {
		try {
			let duels = await duelModel.findById(duelId);
			if (duels) {
				return duels;
			}
		} catch (e) {
			console.log(
				"Error: invalid findDuel() request... Probably an invalid id."
			);
		}
		return null;
	}
	static async login() {
		try {
			const csrfTokenResponse = await agent.get('https://codeforces.com/enter');
			// console.log(csrfTokenResponse.text);
			const csrfToken = csrfTokenResponse.text.match(/name="X-Csrf-Token" content="(.*?)"/)[1];
			const loginResponse = await agent
				.post('https://codeforces.com/enter')
				.type('form')
				.send({
					csrf_token: csrfToken,
					action: 'enter',
					handleOrEmail: username,
					password: password,
				})
				.set('Cookie', cookieJar.getCookieStringSync('https://codeforces.com'));
			// console.log(loginResponse.req.headers);
			if (loginResponse.redirects[0].includes('/register')) {
				console.log('Login failed');
				return false;
			}
			console.log('Logged in');
			return true;
		} catch (error) {
			console.error('Login error:', error);
			return false;
		}
	}
	static async submit(contestId, problemIndex, submission) {
		// console.log(contestId, problemIndex, submission);
		let LoginResponse = await this.login();
		// console.log(LoginResponse);
		if (LoginResponse === true) {
			try {
				const csrfTokenResponse = await agent
					.get(`https://codeforces.com/contest/${contestId}/submit`)
					.set('Cookie', cookieJar.getCookieStringSync('https://codeforces.com'));
				const csrfToken = csrfTokenResponse.text.match(/name="X-Csrf-Token" content="(.*?)"/)[1];
				// console.log(csrfToken);/
				const response = await agent
					.post(`https://codeforces.com/contest/${contestId}/submit`)
					.type('form')
					.send({
						csrf_token: csrfToken,
						ftaa: '',
						bfaa: '',
						action: 'submitSolutionFormSubmitted',
						submittedProblemIndex: problemIndex,
						programTypeId: submission.languageCode,
						contestId: contestId,
						source: submission.codeContent,
						tabSize: '4',
						sourceCodeConfirmed: 'true',
					})
					.set('Cookie', cookieJar.getCookieStringSync('https://codeforces.com'));
				// console.log(response.req.headers);
				console.log(`https://codeforces.com/contest/${contestId}/my`);
				const subPage = await agent
					.get(`https://codeforces.com/contest/${contestId}/my`)
					.set('Cookie', cookieJar.getCookieStringSync('https://codeforces.com'));
				// console.log(subPage.text);
				const cc = subPage.text.match(/name="cc" content="(.*?)"/)?.[1];
				const pc = subPage.text.match(/name="pc" content="(.*?)"/)?.[1];
				const targetClassName = 'view-source';
				const regex = new RegExp(`<a[^>]*class=["']${targetClassName}["'][^>]*>([^<]*)<\/a>`);
				const match = subPage.text.match(regex);
				let submissionId;
				// console.log(match);
				if (match && match[1]) {
					submissionId = match[1].trim();
					return [true, {
						'cc': cc,
						'pc': pc,
						'submissionId': submissionId,
						'contestId': contestId,
						'submissionUrl': `https://codeforces.com/contest/${contestId}/submission/${submissionId}`,
						'submissionTime': new Date().getTime(),
						'code': submission.codeContent.trim()
					}];
				}
				return [false];
				
			}
			catch (e) {
				console.log(e);
				return [false, { 'Error': 'Submission Failed' }];
			}
		}
		else {
			return [false, { 'Error': 'Login Failed' }];
		}
	}

	static async addOrUpdateSubmissions(duelId, newData) {
		// Check if a document with the given duelId exists
		const existingDocument = await submissionModel.findOne({ duelId });

		if (existingDocument) {
			// If the document exists, update the submissions array
			existingDocument.submissions.push(newData);
			await existingDocument.save();
		} else {
			// If the document doesn't exist, create a new one and add the data
			const newDocument = new submissionModel({ duelId, submissions: [newData] });
			await newDocument.save();
		}
	}
}

export default submissionManager;