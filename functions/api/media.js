const { db } = require('../util/admin');

/* GET HTTP Request
  curl -X GET {{base_url}}/media
  */
exports.getAllMedia = (request, response) => {
  db
    .collection('media')
    .orderBy('media_name', 'asc')
    .get()
    .then((data) => {
      let media = [];
      
      data.forEach((doc) => {
        let imgname = "thumbnail/" + doc.data().media_filename.split('.')[0] + ".jpg";

        media.push({
          active: doc.data().active,
          created_at: doc.data().created_at,
          created_by: doc.data().created_by,
          lexicon: ( doc.get('lexicon') == undefined ? 
            { movement: doc.data().media_category,
              body_direction: '',
              tags: doc.data().media_tags
            } : doc.data().lexicon  ),
          filename: doc.data().media_filename,
          id: doc.id,
          name: doc.data().media_name,
          description: doc.data().description,
          media_type: doc.data().media_category,
          thumbnail: imgname
        });
      });
      return response.json(media);
    })
    .catch((err) => {
      console.error(err);
      return response.status(500).json({ error: err.code});
    });
};

/* POST HTTP Request
   curl -X POST \
        --url {{base_url}}/media/add \
        --header 'Content-Type: application/json' \
        --data '{
            "id": "{{id}}",
            "filename": "file.mp4",
            "tags": "movement"
          }' 
*/
exports.addMedia = (request, response) => {
  if (request.body.filename.trim() === '') {
    return response.status(400).json({ filename: 'Must not be empty' });
    }
    
    const newMedia = {
        active: request.body.active || true,
        created_at: new Date().toISOString(),
        created_by: request.user.username,
        media_filename: request.body.filename || "",
        media_name: request.body.name || "Untitled",
        media_tags: request.body.tags || "Unknown",
        lexicon: {
          movement: request.body.category || "",
          body_direction: request.body.body_direction || ""
        },
    }
    db
        .collection('media')
        .add(newMedia)
        .then((doc)=>{
            const responseItem = newMedia;
            responseItem.id = media_name;  // Rename with movement name
            return response.json(responseItem);
        })
        .catch((err) => {
      response.status(500).json({ error: 'Something went wrong' });
      console.error(err);
    });
};

/* DELETE HTTP Request
  curl --request DELETE \
  --url {{base_url}}/media/{{id}} \
  --header 'Content-Type: application/json'
*/
exports.deleteMedia = (request, response) => {
  const document = db.doc(`/media/${request.params.id}`);
    document
        .get()
        .then((doc) => {
            if (!doc.exists) {
                return response.status(404).json({ error: 'Media not found' })
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

/* PUT HTTP Request
  curl --request DELETE \
  --url {{base_url}}/media/{{id}} \
  --header 'Content-Type: application/json'
*/
exports.editMedia = ( request, response ) => { 
  if(request.body.id || request.body.created_at){
      response.status(403).json({message: 'Not allowed to edit'});
  }
  let document = db.collection('media').doc(`${request.params.id}`);
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