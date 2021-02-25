const { db } = require('../util/admin');
const util = require('util');

// 
exports.getAllRoutines = (async (request, response) => {
  db
    .collection('routines')
    .orderBy('created_at', 'desc')
    .get()
    .then((data) => {
      let routines = [];
      
      data.forEach((doc) => {
        // console.log(util.inspect(doc.data()));
        let num = 0;
        (doc.data().mArr ? num = doc.data().mArr.length : 
         num = doc.data().mList.split(",").length)

      routines.push({
        created_at: doc.data().created_at,
        id: doc.id,
        name: doc.data().name,
        mList: doc.data().mList,
        num_movements: num,
        username: doc.data().username,
        video_url: doc.data().video_url
        });
      });
      return response.json(routines);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code});
    });
  
});

// routines/pHm5azU9gLAAw2zg4z6P
exports.getARoutine = (async (request, response) => {
  const routineId = request.params.id;
  if (request.query.id){
    routineId = request.query.id
  }
  
  const routine = [];
  if (routineId) {
    console.log(`Get movements for routine ${routineId}`);
    const routineDoc = await db.doc(`routines/${routineId}`).get();
    const routineData = routineDoc.data();
    if (!routineData){
      // console.error('Nothing!');
      return [];
    }
    if (routineData.mArr){
      const movementArray = routineData.mArr;
      const fetchPromises = [] //: Promise<DocumentSnapshot>[] =[];
      movementArray.forEach((mid) => {
        // console.log(`Getting data for movement ${mid}`);
        const nextPromise = db.doc(`media/${mid}`).get();
        console.log(util.inspect(nextPromise));
        // TODO(kchuang): add image thumbnail and order
        fetchPromises.push(nextPromise);
      });
      const snapshots = await Promise.all(fetchPromises);
      const movementData = snapshots.map((snapshot) => { return snapshot.data() });
      // console.log('Done fetching!' + (util.inspect(movementData)));

      routine.push({
        created_at: routineData.created_at,
        name: routineData.name,
        username: routineData.username,
        video_url: routineData.video_url,
        num_movements: movementData.length,
        movements: movementData
      })
    }
    return response.json(routine);

  } else {
    const routineDoc = await db.collection('routines').orderBy('created_at', 'desc').get();
    const listRoutines = routineDoc.docs;
      console.error('All Done! no id. check logs');
      return response.status(500).json({ error: 'No id given.' });
  }
});

exports.addRoutine = (request, response) => {
	// if (request.body.movements.length === 0) {
	// 	return response.status(400).json({ movements: 'Must not be empty' });
  // }
    
    const newRoutine = {
        // id is automatically generated
        movements: request.body.movements,
        mList: request.body.mList,
        name: request.body.name,  // displayname
        username: request.user.username,
        created_at: new Date().toISOString(),
        video_url: request.body.video_url
    }
    db
      .collection('routines')
      .add(newRoutine)
      .then((doc)=>{
          const responseItem = newRoutine;
          responseItem.id = doc.id;
          return response.json(responseItem);
      })
      .catch((err) => {
      response.status(500).json({ error: 'Something went wrong' });
      console.error(err);
    });
};

exports.deleteRoutine = (request, response) => {
  const document = db.doc(`/movement/${request.params.id}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
              return response.status(404).json({ error: 'Movement not found' })
            }
            return document.delete();
        })
        .then(() => {
            response.json({ message: 'Delete successfull' });
        })
        .catch((err) => {
            console.error(err);
            return response.status(500).json({ error: err.code });
        });
};


exports.editRoutine = ( request, response ) => { 
  if(request.body.id || request.body.created_at){
      response.status(403).json({message: 'Not allowed to edit'});
  }
  let document = db.collection('movement').doc(`${request.params.id}`);
  document.update(request.body)
  .then(()=> {
      response.json({message: 'Updated successfully'});
  })
  .catch((err) => {
      console.error(err);
      return response.status(500).json({ 
              error: err.code 
      });
  });
};


function LoadMediaDetail(MediaId) {
  let media = GetAllMedia();
  let mediaDetails = [];
  media.forEach((doc) => {

      if (doc.id == MediaId){

        mediaDetails.push({
          active: doc.active,
          created_at: doc.created_at,
          created_by: doc.created_by,
          category: doc.media_category,
          filename: doc.media_filename,
          name: doc.media_name,
          tags: doc.media_tags,
        });
      } 

    }); 
  return mediaDetails;
}

function GetAllMedia() {
	// function GetAllMedia(req, res, db) {
  db
    .collection('media')
    .orderBy('media_name', 'asc')
    .get()
    .then((data) => {
      
      let media = [];
      data.forEach((doc) => {

				// if (doc.data().id == MediaId){

          media.push({
            active: doc.data().active,
            created_at: doc.data().created_at,
            created_by: doc.data().created_by,
            category: doc.data().media_category,
            filename: doc.data().media_filename,
            name: doc.data().media_name,
            tags: doc.data().media_tags,
          });
        // } 
				// } 
        // } 

      }); 
      return media;
    })
    .catch((err) => {
      console.error(err);
      // return response.status(500).json({ error: err.code});
    });
}
