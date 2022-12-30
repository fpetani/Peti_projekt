var express = require('express')
var app = express();
var bodyParser=require('body-parser');
const path = require("path");
const fs = require("fs");
//const multer = require("multer");
//const fse = require('fs-extra');


const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 8080;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});



app.get('/video', function(req, res){
    res.sendFile(path.join(__dirname, "public", "video.html"));
})


if (externalUrl) {
    const hostname = '127.0.0.1';
    app.listen(port, hostname, () => {
    console.log(`Server locally running at http://${hostname}:${port}/ and from
    outside on ${externalUrl}`);
    });
    }
    else{
      app.listen(port)
      console.log('server running locally on port 8080')
}

  