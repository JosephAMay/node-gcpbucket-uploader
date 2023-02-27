require('dotenv').config()

const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')

const PORT = process.env.PORT | 5000;

//Not required in this version. Keeping for later adjustments as needed
const fs = require('fs');
const path = require('path');
const http = require('http');
const url = require('url');
const opn = require('open');
const destroyer = require('server-destroy');

//OAuth stuff
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '54008615149-p6qfhr1f913ue3aodb3n4l0jhe4ab7tl.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);
const {google} = require('googleapis');
const people = google.people('v1');

//Middle ware
app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());

app.get('/', (req,res) =>{
    res.render('index')
})

app.get('/login', (req, res)=>{
    res.render('login')
})

app.post('/login', (req, res) =>{
    let token = res.body.token;
    async function verify() {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  // const domain = payload['hd'];
  console.log(payload)
}
verify()
.then(()=>{
  res.cookie('session-token', token);
  res.send('sucess');
})
.catch(console.error);
    console.log(token);
})

app.get('/dashbboard', checkAuthenticated, (req,res) =>{
  let user = req.user;
  res.render('dashboard',{user});
})

app.get('/protectedroute', checkAuthenticated, (req,res)=>{
  res.send('This route is protected');
  res.render('protectedroute.ejs');
})

app.get('/logout', (req, res)=>{
  res.clearCookie('session-token');
  res.redirect('/login')
})

function checkAuthenticated(req, res, next){
    let token = req.cookies('session-token');

    let user = {};

    async function verify() {
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,
      });
      const payload = ticket.getPayload();
      user.name = payload.name;
      user.email = payload.email;
      user.picture = payload.picture;
    }
    verify()
    .then (()=>{
      req.user = user;
      next();
    })
    .catch(err=>(
      res.redirect('/login')
    ))

}

app.listen(PORT, () => {
    console.log('Server Running on port', PORT);
})
