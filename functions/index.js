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
  'https://mimo-cat-f82c7--preview-5g5u3mvt.web.app',
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

/* Routines API endpoints */
const {
  getAllRoutines,
  addRoutine,
  deleteRoutine,
  editRoutine
} = require('./api/routines')

app.get('/routines', auth, getAllRoutines);
app.post('/routines/add', auth, addRoutine);
app.delete('/routines/:id', auth, deleteRoutine);
app.put('/routines/:id', auth, editRoutine);

/* Movements API endpoints */
const {
  getAllMovements,
  addMovement,
  deleteMovement,
  editMovement
} = require('./api/movements')

app.get('/movements', auth, getAllMovements);
app.post('/movements/add', auth, addMovement);
app.delete('/movements/:id', auth, deleteMovement);
app.put('/movements/:id', auth, editMovement);

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



// Open endpoint for diagnostics 
app.get("/moo", (req, res) => {
  const reqQueryObject = "1 " + req.query // returns object with all parameters
  return res.json(allowedOrigins);
})



// app.listen(5000, () => console.log(`App is running`));
// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });


/* Exports function that expose the /api route to at us-east4 region 
 * Pattern https://<hosting-region>-<project-id>.cloudfunctions.net/api
 * URL https://us-east4-mimo-cat-f82c7.cloudfunctions.net/api
*/
exports.api = functions.region('us-east4').https.onRequest(app);
