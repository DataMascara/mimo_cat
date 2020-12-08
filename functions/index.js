const functions = require('firebase-functions');
const app = require('express')();
const cors = require("cors");
const auth = require('./util/auth');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const allowedOrigins = [
  'http://localhost:3000', 
  'https://mimo-cat-f82c7.web.app'
];
const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}
app.use(cors(corsOptions));

/* Media API endpoints */
const {
    getAllMedia,
    addMedia,
    deleteMedia,
    editMedia
} = require('./api/media')

app.get('/media', auth, getAllMedia);
app.post('/media/add', auth, addMedia);
app.delete('/media/:id', auth, deleteMedia);
app.put('/media/:id', auth, editMedia);

// Users
const {
  loginUser,
  signUpUser,
  uploadProfilePhoto,
  getUserDetail,
  updateUserDetails
} = require('./api/users');

// Users
app.post('/login', loginUser);
app.post('/signup', signUpUser);
app.post('/user/image', auth, uploadProfilePhoto);;
app.get('/user', auth, getUserDetail);
app.post('/user', auth, updateUserDetails);



/* Exports function that expose the /api route to at us-east4 region 
 * Pattern https://<hosting-region>-<project-id>.cloudfunctions.net/api
 * URL https://us-east4-mimo-cat-f82c7.cloudfunctions.net/api
*/
exports.api = functions.region('us-east4').https.onRequest(app);