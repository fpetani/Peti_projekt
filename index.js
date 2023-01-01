var express = require('express');
const webpush = require('web-push');
var app = express();
var bodyParser=require('body-parser');
const path = require("path");
const fs = require("fs");
const multer = require('multer');

const publicVapidKey = 'BEq-5jXDM1fUR6COxrFw3qeQyASJCH9mh10BM2eK4_MKwQov62T9_ycQMsqmnamLGEkFicTBAWOPZuW0OBLYT6o'
const privateVapidKey = 'W3itn4ZPfLvAu3E-GOrnzH2g-UG7BmGp88xC_lQca6k'

webpush.setVapidDetails('mailto:filippetani123@gmail.com', publicVapidKey, privateVapidKey)


const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 5000;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

const VIDEOS = path.join(__dirname, "public", "videos");
var uploadVideo = multer({
    storage:  multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, VIDEOS);
        },
        filename: function (req, file, cb) {
            let fn = file.originalname.replaceAll(":", "-");
            cb(null, fn);
        },
    })
}).single("video");


app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

//Subscribe route
app.post('/subscribe', (req, res)=> {
    //Get push subcription object
    const subscription = req.body;

    const payload = JSON.stringify({title: 'Push Test'})

    webpush.sendNotification(subscription, payload).catch(err => console.error(err));
    res.status(201).json({});

    console.log(subscription)
})

app.get('/video', function(req, res){
    res.sendFile(path.join(__dirname, "public", "video.html"));
})

app.delete('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join(__dirname, 'uploads', filename);
    fs.unlink(filepath, err => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send('File deleted successfully');
      }
    });
  });


if (externalUrl) {
    const hostname = '127.0.0.1';
    app.listen(port, hostname, () => {
    console.log(`Server locally running at http://${hostname}:${port}/ and from
    outside on ${externalUrl}`);
    });
    }
    else{
      app.listen(port)
      console.log('server running locally on port 5000')
}

  