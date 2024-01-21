import superagent from 'superagent';
import * as cheerio from 'cheerio';
let client = superagent.agent();
const delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
class Scrapper {
    static async getVerdict(submissionId, contestId) {
        let link = `https://codeforces.com/contest/${contestId}/submission/${submissionId}`;
        // console.log(link)
        let response;
        try {
            response = await client.get(link);
        } catch (e) {
            console.log(`Can't fetch submisson ${contestId}-${submissionId} \n1. ${e}.`);
        }
        let cnt = 3;
        while (!response || !response.ok) {
            await delay(1000);
            try {
                response = await client.get(link);
            } catch (e) {
                console.log(`Can't fetch problem ${contestId}-${index} \n2. ${e}.`);
                cnt--;
                if(cnt <= 0){
                    return [false];
                }
            }
            cnt--;
            if(cnt <= 0){
                return [false];
            }
        }
        try{
            let htmlText = response.text;
            const $ = cheerio.load(htmlText);
            const fifthTdSecondTr = $('table tbody tr:nth-child(2) td:nth-child(5)');
            const innerHTML = fifthTdSecondTr.html();
            // console.log(innerHTML);
            return innerHTML;
        }catch(e){
            console.log(e);
            return [false];
        }
    }
}

export default Scrapper;