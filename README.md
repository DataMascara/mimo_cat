# minimum movement catalog
`mimo_cat`

This is a database of dance movements.

Project idea from Maho Ogawa ([www.suisoco.com](https://www.suisoco.com)) for her dissertation study at Brooklyn College.

The project is based off of the project spec requirements and prototype produced by students in CISC 4900 of Fall 2020: @khinethet, @stevezhuravel, @CallMeOnii-chan supervised by @katychuang

# Setup

## Dependencies

* Firebase CLI ([firebase-tools](https://github.com/firebase/firebase-tools))
* Node/NPM
* ReactJS - *this project specifically uses `create-react-app`*
* [Material UI](https://material-ui.com/), [Material UI Icons](https://material-ui.com/components/material-icons/)
* Firebase firestore, storage, and hosting 

---

## Contribution guide

First - contact (@[katychuang](https://github.com/katychuang)) to get permissions. 

### Setup from this repo 

1. Install CLI tools needed for managing various 
    - All at once `npm i -g firebase-tools create-react-app` 
2. Clone this repository `git clone git@github.com:DataMascara/mimo_cat.git`
3. Install backend dependences: 
    - Go into the project root `cd mimo_cat` and then one more time into functions subfolder `cd functions`.
    - From within the functions folder, install dependencies. `npm i`
4. Configuring access with firebase: 
    - Copy the configs from the firebase console under your app settings information page into `config.js`. The *config-example.js* file shows the structure of the file. 
6. Install frontend dependencies:
    - Go into the view subfolder. From the project root, `cd view`
    - install dependecies. Running `npm i` works because there is a `package.json` file in that subfolder that specifies which libraries to install.

### Development flow

To test api locally, `firebase serve --only functions` is fine since there's only one function in this codebase. For added specificity while developing, you can call it with `firebase serve --only functions:api`

To deploy the api changes, `firebase deploy --only functions` will deploy all the functions while `firebase serve --only functions:api` will only deploy the api function.

Note that the region settings are specificed in the the code with the function `.region('us-east4')`

To test the UI locally, you must be in the view folder before running `npm start` - this command looks at the package.json file for configuration information. While you're in that mode, it will refresh the page as you make changes to the JS files. You can set the proxy field in the `package.json` to connect to a specific backend location. Exit out of that preview mode using `CTRL+C` to return back to a regular terminal prompt. Make sure that you've cleaned up the URLs to the backend if you've been shifting between localhost and prod modes. 

To deploy the UI changes, `npm run build` while in the view folder to use creat-react-app's tools for packaging a deployable version. The `package.json` is configured such that a new build folder is created with the files to deploy in there. Go back to the root folder `cd ..` to run the firebase commands for deploying to the hosting server: `firebase deploy --only hosting --project <project-id>` 

---

## Folder Structure of the project

```sh
├── .firebaserc
├── firebase.json
├── functions
│   ├── api
│   │   ├── media.js
│   │   └── routine.js
│   │   └── users.js
│   ├── index.js
│   └── util
│       ├── admin.js
│       ├── auth.js
│       ├── config.js
│       └── validators.js
└── view
    ├── build              # created from `npm run build`, deployed folder
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



## First Time Setup of a firebase project

1. In Firebase console: go to the Functions section and click button 'get started'
2. in terminal of local computer, install firebase command line tools using npm: `npm install -g firebase-tools` (this is a one time thing on a new computer)
3. In the directory where you want to start your project; `firebase init`
    1. select set up functions only (3rd on list), and use exiesting project. Javascript; no eslint; yes to dependencies installed now
    2. This creates a subfolder, `functions` as its own nodejs app. At the time of this writing it is set to engine node v12.
    3. You should see the message in your console: `Firebase initialization complete!`
    4. Also you now have `firebase.json`, `.firebaserc` files created for you.
4. In Firebase console go to Firestore section and click button 'create database'
  1. Select from production or test
  2. Select region - here we defaulted to us-east4
5. In your terminal you need to install some NPM dependencies for API creationg and also create files that handle the information exposed by the API (see scripts.sh for examples)
    1. `npm i express` allows us to use the express library
    2. `npm i firebase-admin` allows interaction firebase project
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


---

# URL Patterns

In the comments of the JS files, you'll see these as the {{base_url}} variable

**Firebase Functions**

*For api*

* On localhost: `http://localhost:5000/<project-id>/<region>/<function-name>/<app-routes>`
* On prod: `https://<hosting-region>-<project-id>.cloudfunctions.net/api`

**Firebase Hosting**

*For frontend*

* On localhost: https://localhost:3000
* On prod: https://mimo-cat-f82c7.web.app

**Firebase Storate**

*For media assets*

* `https://storage.googleapis.com/<project-id>/<folder>/<path>/<file>`

---

# Credits

* Favicon https://thenounproject.com/term/japanese/42819/

# References

Helpful links for firebase dev:

* Fireabse Guides https://firebase.google.com/docs/guides
* Firebase JavaScript SDK Reference https://firebase.google.com/docs/reference/js
* Sample code
    * getting started https://firebase.google.com/docs/functions/get-started 
    * see some example functions https://github.com/firebase/functions-samples
    * Firebase quick start exampleshttps://github.com/firebase/quickstart-js


Helpful Links for frontend dev:

* In case you're looking for Material-UI v5 changes, check the migration guide https://next.material-ui.com/guides/migration-v4/#pagination