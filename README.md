# mimo_cat
minimum movement catalog

Project idea from Maho Ogawa ([www.suisoco.com](https://www.suisoco.com)) of Brooklyn College.

The project is based off of the project spec requirements and prototype produced by students in CISC 4900 of Fall 2020: @khinethet, @stevezhuravel, @CallMeOnii-chan supervised by @katychuang

---

Folder Structure

```sh
├── .firebaserc
├── firebase.json
├── functions
│   ├── api
│   │   ├── media.js
│   │   └── users.js
│   ├── index.js
│   └── util
│       ├── admin.js
│       ├── auth.js
│       ├── config.js
│       └── validators.js
└── view
    ├── build
    ├── package.json
    ├── public
    └── src
        ├── App.js
        ├── components
        │   ├── account.js
        │   ├── media.js
        │   ├── movement.js
        │   └── routine.js
        ├── index.js
        ├── pages
        │   ├── home.js
        │   ├── login.js
        │   └── signup.js
        ├── setupTests.js
        └── util
            └── auth.js
```

---

# Installing from this directory

1. `npm i -g firebase-tools create-react-app``
2. Clone the repository
3. Go into the project root `cd mimo_cat` and then one more time into functions subfolder.
4. From the functions folder, install dependencies. `npm i`
5. Copy the configs from the firebase console into config.js. The config-example.js file shows the structure of the file.
6. Move into the view folder, install dependecies. `npm i`


# First Time Setup

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
8. Create front end using tool called *create-react-app* that automates much of the processes.
    1. Install this tool with `npm install -g create-react-app`
    2. Use this command from root directory to create subdirectory `create-react-app view`
    3. Lots of UI design work to be done here, beyond a succinct bullet point.
    4. Test you frontend ui with `npm start`
    5. View the changes in your browser, at `localhost:3000`
9. For designing with Material Design, install material-ui and other useful packages
    1. `npm i @material-ui/core@next @emotion/react @emotion/styled` will get the latest packages
    2. In each of your reactjs files, import the components you want to use
    3. `npm i @material-ui/icons axios react-router-dom` are more packages you might find useful
    4. Set proxy in the package.json file to be able to connect to the correct backend
9. When you're ready to package your frontend, `npm run build`
10. When you're ready to deploy, from root directory `firebase deploy`
    * You can use the preview feature with:  firebase hosting:channel:deploy <nickname> --project <project-id>
    firebase hosting:channel:deploy CHANNEL_ID
    * You have to set up the hosting configs with `firebase init` (it will create a firebase.json file) to be able to deploy to hosting.

Helpful links for firebase dev:
* *getting started https://firebase.google.com/docs/functions/get-started?authuser=2
* *see some example functions https://github.com/firebase/functions-samples

---

# URL Patterns for api

In the comments of the JS files, you'll see these as the {{base_url}} variable

**Firebase Functions**

* On localhost: `http://localhost:5000/<project-id>/<region>/<function-name>/<app-routes>`
* On prod: `https://<hosting-region>-<project-id>.cloudfunctions.net/api`

**Firebase Hosting**

* On prod: https://mimo-cat-f82c7.web.app

