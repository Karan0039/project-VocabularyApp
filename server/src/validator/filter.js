const filter = (obj) => {
    obj = obj["results"][0]
    let arr = obj["lexicalEntries"]
    let res = []
    let flag = true
    for (let el of arr) {
        let resObj = el["lexicalCategory"]?{ category: el["lexicalCategory"]["id"] }:{category:""}
        let entriesObj = el["entries"][0]
        resObj["etymologies"] = entriesObj["etymologies"]||""
        res.push(resObj)
        resObj = el["lexicalCategory"]?{ category: el["lexicalCategory"]["id"] }:{category:""}
        for (let key in entriesObj) {
            if (key == "pronunciations" && flag) {
                resObj = {}
                resObj[key] = entriesObj[key][0]["audioFile"]
                res.push(resObj)  
                resObj = el["lexicalCategory"]?{ category: el["lexicalCategory"]["id"] }:{category:""}
                flag = false
            }

            if (key == "senses") {
                for (let i = 0; i < entriesObj[key].length; i++) {
                    let sensesObj = entriesObj[key][i]
                    for (let key in sensesObj) {

                        if (key == "definitions") resObj[key] = sensesObj[key]
                        if (key == "examples") {
                            resObj[key] = sensesObj[key]
                            for (let el of resObj[key]) {
                                if (el["notes"]) delete el["notes"]
                            }
                        }
                        if (key == "subsenses") {
                            for (let j = 0; j < sensesObj[key].length; j++) {
                                let subSensesObj = sensesObj[key][j]
                                let tempObj = el["lexicalCategory"]?{ category: el["lexicalCategory"]["id"] }:{category:""}
                                for (let key in subSensesObj) {
                                    if (key == "definitions") tempObj[key] = subSensesObj[key]
                                    if (key == "examples") tempObj[key] = subSensesObj[key]
                                }
                                if (Object.keys(tempObj).length > 1) res.push(tempObj)
                            }
                        }
                    }
                    if (Object.keys(resObj).length > 1) res.push(resObj)
                    resObj = el["lexicalCategory"]?{ category: el["lexicalCategory"]["id"] }:{category:""}
                }
            }
        }
    }
    return res
}

module.exports = { filter }