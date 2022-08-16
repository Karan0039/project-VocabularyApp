const express = require('express');
const bodyParser = require('body-parser');
const route = require('./routes/route.js');
const { default: mongoose } = require('mongoose');
const app = express()
const cors = require("cors")
const path = require("path");

app.use(cors())

app.use(bodyParser.json());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../../client/build')));

app.use('/', route)

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../../client/build', 'index.html'));
  });
// app.use(express.static(__dirname+"../../../build"))
// app.use(express.static("public"));
// app.get("/", function(req,res){
//     res.sendFile(path.join(__dirname+ "../../../build/index.html"));
// })


mongoose.connect("mongodb+srv://FunctionUp:heeheehee123@cluster0.ambyf.mongodb.net/dictionary", {
    useNewUrlParser: true
})
    .then(() => console.log("MongoDb is connected"))
    .catch(err => console.log(err))


app.listen(process.env.PORT || 4000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 4000))
}); 