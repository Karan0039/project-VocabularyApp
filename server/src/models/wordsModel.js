const mongoose = require("mongoose")

const wordsSchema = new mongoose.Schema({
    word: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    etymologies: {
        type: String,
    },
    pronunciations: {
        type: String
    },
    senses: [{
        category: { type: String },
        definitions: { type: String },
        examples: [{ type: String }],
        _id: false
    }]
}, { timestamps: true }) 

module.exports = mongoose.model("Words", wordsSchema)