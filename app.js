const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const mongoDbStore = require('connect-mongodb-session')(session);
const passport = require('passport');
const app = express();
// const { google } = require('googleapis')
// const fileUpload = require('express-fileupload')


const passportSetup = require('./config/passport-setup');
const keys = require('./config/keys');
const authRoutes = require('./routes/auth-routes');
const mainRoutes = require('./routes/main')
const isAuth = require('./middleware/is-auth');



app.set('view engine', 'ejs');
app.set('views', 'views');



const store = new mongoDbStore({
    uri:keys.mongoDb.dbURI,
    collection:'sessions'
})


app.use(express.static(path.join(__dirname, 'public')));


app.use(
    session({ secret: 'my secret',
     resave: false, 
     saveUninitialized: false,
     store:store
    })
);
//Then, the first middleware, initialize(), will try to find that
// user in the request, or create it as an empty object if 
//it doesn't exist (which would mean the user is not authenticated). 
app.use(passport.initialize());

//in session deserialized execute and add 
//the user into req.user
app.use(passport.session());

app.use('/auth',authRoutes);
app.use(mainRoutes);

app.get('/', (req,res,next)=>{
    res.render('home');
})


mongoose
    .connect(keys.mongoDb.dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        app.listen(3000,()=>{
            console.log('server started');
        })
    }).catch(e => {
        console.log(e);
    })

    // When an authenticated request is made, Express will load the session into the req, making our serialized user data available at req.session.passport.user.

    // Then, the first middleware, initialize(), will try to find that user in the request, or create it as an empty object if it doesn't exist (which would mean the user is not authenticated). 
    
    // And then, session() will kick in which to determine if the request is authenticated by trying to find a serialized object in it.
     
    // When it finds it, it'll pass it to deserializeUser which will use it to get the whole user data (maybe from the DB) and add it to req.user where we can use it to create other requests.
    
    // So, even though serializeUser is only called on log in, deserializeUser is a global middleware that'll get executed on every single request to make the full user object available for authenticated requests.
    
    

//     app.use(fileUpload());
// app.post('/upload', function (req, res) {

//     // not auth
//     if (!req.user) res.redirect('/auth/login')
//     else {
//         // auth user

//         // config google drive with client token
//         const oauth2Client = new google.auth.OAuth2()
//         oauth2Client.setCredentials({
//             'access_token': req.session.passport.user.accessToken
//         });

//         const drive = google.drive({
//             version: 'v3',
//             auth: oauth2Client
//         });

//         //move file to google drive

//         let { name: filename, mimetype, data } = req.files.file_upload

//         const driveResponse = drive.files.create({
//             requestBody: {
//                 name: filename,
//                 mimeType: mimetype
//             },
//             media: {
//                 mimeType: mimetype,
//                 body: Buffer.from(data).toString()
//             }
//         });

//         driveResponse.then(data => {

//             if (data.status == 200){
//                 console.log('file uploaded succeessfully');
//                 res.redirect('/dashboard') // success
//             }
//             else{
//                 console.log('unsucceess')
//                 res.redirect('/dashboard') // unsuccess
//             } 

//         }).catch(err => { throw new Error(err) })
//     }
// })