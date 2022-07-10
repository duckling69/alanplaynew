require("dotenv").config()

const express = require('express');
const SpotifyWebApi = require('spotify-web-api-node');

const lyricsFinder = require("lyrics-finder");
const cors = require("cors")
const bodyParser = require("body-parser")

const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
      redirectUri: process.env.REDIRECT_URI,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken,
    })
  
    spotifyApi
      .refreshAccessToken()
      .then(data => {
        res.json({
          accessToken: data.body.accessToken,
          expiresIn: data.body.expiresIn,
        })
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  })

app.post('/login',(req,res)=>{
    const code = req.body.code;
    const spotifyApi = new SpotifyWebApi({
        redirectUri:'http://localhost:3000',
        clientId:'5cab7e32768645939367333788c97773',
        clientSecret:'4bc951c6b7074456ae91783fa40e706c'
    })
    spotifyApi.authorizationCodeGrant(code).then(data => {
      res.json({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      })
    })
    .catch(err => {
        res.sendStatus(400)
      })
})
app.get("/lyrics", async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
  res.json({ lyrics })
})
app.listen(3001)