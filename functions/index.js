const functions = require('firebase-functions');
const app = require('express')();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

/* Media API endpoints */
const {
    getAllMedia,
    addMedia,
    deleteMedia,
    editMedia
} = require('./api/media')

app.get('/media', getAllMedia);
app.post('/media/add', addMedia);
app.delete('/media/:id', deleteMedia);
app.put('/media/:id', editMedia);

/* Exports function that expose the /api route to at us-east4 region 
 * Pattern https://<hosting-region>-<project-id>.cloudfunctions.net/api
 * URL https://us-east4-mimo-cat-f82c7.cloudfunctions.net/api
*/
exports.api = functions.region('us-east4').https.onRequest(app);