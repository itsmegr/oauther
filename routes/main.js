const router = require('express').Router();
const isAuth = require('../middleware/is-auth');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis')

router.get('/profile', isAuth, (req, res, next) => {

    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({
        'access_token': req.session.passport.user.accessToken
    });

    const drive = google.drive({
        version: 'v3',
        auth: oauth2Client
    });
    // const id = '1TYac8hKIH_HlJgjzYTmHLa4_81OcFErr';
    //https://drive.google.com/file/d/1TYac8hKIH_HlJgjzYTmHLa4_81OcFErr/view?usp=sharing
    // var dest = fs.createWriteStream(path.join('file', 'xyz.pdf')); // Please set the filename of the saved file.
    // drive.files.get(
    //     {fileId: id, alt: "media"},
    //     {responseType: "stream"},
    //     (err, {data}) => {
    //       if (err) {
    //         console.log(err);
    //         return;
    //       }
    //       data
    //         .on("start", () => console.log("Started."))
    //         .on("end", () => console.log("Done."))
    //         .on("error", (err) => {
    //           console.log(err);
    //           return process.exit();
    //         })
    //         .pipe(dest);
    //     }
    //   ); 

    //for uploading the files in google drive
    // const fileMetadata = {
    //     'name': 'Copy_of_1_from_local'
    // };
    // const media = {
    //     mimeType: 'application/pdf',
    //     body: fs.createReadStream(path.join('file', '1.pdf'))
    // };
    // drive.files.create({
    //     resource: fileMetadata,
    //     media: media,
    //     fields: 'id'
    // }, (err, file) => {
    //     if (err) {
    //         // Handle error
    //         console.error(err);
    //     } else {
    //         console.log('File Id: ', file.data.id);
    //         res.send(file);
    //     }
    // });
    res.render('profile', {
        name: req.user.username
    })
})


module.exports = router;