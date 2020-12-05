# mimo_cat
minimum movement catalog

---

# Setup

1. In Firebase console: go to the Functions section and click button 'get started'
2. in terminal of local computer, install firebase command line tools using npm: npm install -g firebase-tools (this is a one time thing on a new computer)
3. In the directory where you want to start your project; `firebase init`
  1. select set up functions only (3rd on list), and use exiesting project. Javascript; no eslint; yes to dependencies installed now
  2. This creates a subfolder, `functions` as its own nodejs app. At the time of this writing it is set to engine node v12.
  3. You should see the message in your console: `Firebase initialization complete!`
  4. Also you now have firebase.json, .firebaserc
4. In Firebase console go to Firestore section and click button 'create database'
  1. Select from production or test
  2. Select region - here we defaulted to us-east4
5. In your terminal you need to install some NPM dependencies for API creationg and also create files that handle the information exposed by the API (see scripts.sh for examples)
  1. `npm install i express` allows us to use the express library
  2. `npm i express firebase-admin` allows interaction firebase project
6. When you're ready to deploy, `firebase deploy`


getting started https://firebase.google.com/docs/functions/get-started?authuser=2
see some example functions https://github.com/firebase/functions-samples
---

# URL Patterns for api

In the comments of the JS files, you'll see these as the {{base_url}} variable

**Firebase Functions**

* On localhost: http://localhost:5000/<project-id>/<region>/<function-name>/<app-routes>
* On prod: https://<hosting-region>-<project-id>.cloudfunctions.net/api

---

Examples for localhost HTTP Requests and Responses

```
POST: {{base_url}}/media/add

BODY: {
	"filename": "B-1arm.mp4",
	"tags": "movement"
}

RESPONSE (using an api client, such as Insomnia) 
{
  "media_filename": "B-1arm.mp4",
  "media_name": "Untitled",
  "media_tags": "movement",
  "created_at": "2020-12-05T19:00:57.970Z",
  "id": "K72Fhm9cZzSGq0hEOORa"
}
```

You can use the terminal to test the api endpoint as well 

```
GET {{base_url}}/media

RESPONSE (using curl)
curl {{base_url}}/media
[{"id":"W5lpup9A76ORXGsPkTaE","name":"Untitled","filename":"B-1arm.mp4","tags":"movement"},{"id":"K72Fhm9cZzSGq0hEOORa","name":"Untitled","filename":"B-2arm.mp4","tags":"movement"}]
```