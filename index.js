const express = require('express')
const app = express()
const glob = require('glob')
const cors = require("cors")

glob("./routes/**/*.js", function (er, files) {
  console.log('oath',files);
  for (i= 0 ; i < files.length; i++) {
    var ApiPath = '/api/' + files[i].split('/')[2].replace('.js','').toLowerCase()
    app.use(ApiPath,require(files[i]));
  }
})
app.use(express.json());
app.use(cors({
  origin: [
    'http://localhost:8080',
    'https://localhost:8080'
  ],
  credentials: true,
  exposedHeaders: ['set-cookie']
}))
app.use(express.urlencoded({extended: false}));
app.listen(8000,'0.0.0.0')