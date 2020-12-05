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
  3. Update the functions/index.js and functions/api/object.js files for rendering JSON objects
  4. When ready, preview changes with `firebase serve`
  5. Use curl or an API client to check each of the endpoints
6. User auth requires turning on the type of validation in the firebase console. Enable the Email/Password option.
7. In your console create the new files for user auth and install 
8. When you're ready to deploy, `firebase deploy`


getting started https://firebase.google.com/docs/functions/get-started?authuser=2
see some example functions https://github.com/firebase/functions-samples
---

# URL Patterns for api

In the comments of the JS files, you'll see these as the {{base_url}} variable

**Firebase Functions**

* On localhost: http://localhost:5000/<project-id>/<region>/<function-name>/<app-routes>
* On prod: https://<hosting-region>-<project-id>.cloudfunctions.net/api

---
