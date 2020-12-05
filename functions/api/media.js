const { db } = require('../util/admin');

/* GET HTTP Request
  curl -X GET {{base_url}}/media
  */
exports.getAllMedia = (request, response) => {
	db
		.collection('media')
		.orderBy('created_at', 'desc')
		.get()
		.then((data) => {
			let media = [];
			data.forEach((doc) => {
				media.push({
          id: doc.id,
          name: doc.data().media_name,
          filename: doc.data().media_filename,
          tags: doc.data().media_tags,
          created_by: doc.data().created_by,
					created_at: doc.data().createdAt,
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
				media_filename: request.body.filename,
				media_name: request.body.name || "Untitled",
        media_tags: request.body.tags || "Unknown",
				created_at: new Date().toISOString()
    }
    db
        .collection('media')
        .add(newMedia)
        .then((doc)=>{
            const responseItem = newMedia;
            responseItem.id = doc.id;
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
                return response.status(404).json({ error: 'Car not found' })
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