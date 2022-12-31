var express = require('express');
const webpush = require('web-push');
var app = express();
var bodyParser=require('body-parser');
const path = require("path");
const fs = require("fs");

const publicVapidKey = 'BEq-5jXDM1fUR6COxrFw3qeQyASJCH9mh10BM2eK4_MKwQov62T9_ycQMsqmnamLGEkFicTBAWOPZuW0OBLYT6o'
const privateVapidKey = 'W3itn4ZPfLvAu3E-GOrnzH2g-UG7BmGp88xC_lQca6k'

webpush.setVapidDetails('mailto:test@test.com', publicVapidKey, privateVapidKey)


const externalUrl = process.env.RENDER_EXTERNAL_URL;
const port = externalUrl && process.env.PORT ? parseInt(process.env.PORT) : 8080;

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

//Subscribe route
app.post('/subscribe', (req, res)=> {
    //Get push subcription object
    const subscription = req.body;

    console.log(subscription)

    res.status(201).json({});

    const payload = JSON.stringify({title: 'Push Test'})

    webpush.sendNotification(subscription, payload).catch(err => console.error(err));
})

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

  