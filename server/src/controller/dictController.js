const https = require("https")
const wordModel = require("../models/wordsModel")
const { filter } = require("../validator/filter")

const getMeaning = async function (req, res) {
    try {
        let data = {}
        const app_id = "28457e7a";
        const app_key = "d25b1bd28126454ef2a780671f026d42";
        const wordId = (req.params.word).toLowerCase();
        let getData = await wordModel.findOne({ word: wordId }).lean()
        if (!getData) {
            const options = {
                host: 'od-api.oxforddictionaries.com',
                port: '443',
                path: '/api/v2/entries/en-gb/' + wordId,
                method: "GET",
                headers: {
                    'app_id': app_id, 
                    'app_key': app_key
                }
            };
            let parsed
            https.get(options, (resp) => {
                let body = '';
                resp.on('data', (d) => {
                    body += d;
                });
                resp.on('end', async () => { 
                    parsed = JSON.parse(body)
                    if(parsed.error) return res.send(parsed)
                    parsed = filter(parsed)
                    data["word"] = wordId
                    data["etymologies"] = parsed[0]["etymologies"] ? parsed[0]["etymologies"][0] : ""
                    data["pronunciations"] = parsed[1]["pronunciations"]
                    data["senses"] = []
                    for (let i = 2; i < parsed.length; i++) {
                        let category = parsed[i]["category"]
                        let definitions = parsed[i]["definitions"] ? parsed[i]["definitions"][0] : ""
                        let examples = []
                        for (let j = 0; j < parsed[i]["examples"]?.length; j++) {
                            examples.push(parsed[i]["examples"][j]["text"])
                        }
                        data["senses"].push({ category, definitions, examples })
                    }
                    let createdData = await wordModel.create(data);
                    return res.status(200).send({ status: true, result: createdData })
                });
            });
        }
        else {
            return res.status(200).send({ status: true, result: getData })
        }
    }
    catch (err) {
        res.send("Not Found")
    }
}


module.exports = { getMeaning }