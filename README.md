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
2. Clone this repository, i.e. `git clone git@github.com:DataMascara/mimo_cat.git`

(The following instructions are not manditory, and can be skipped if you don't intend to create your own branch to push changes into before pushing into the main codebase)

3. Create a new branch and switch to the newly made branch (All at once) `git checkout -b <branch-name>`
4. If you need to update your working directory for whatever reason while inside your branch use `git pull https://github.com/DataMascara/mimo_cat.git`
5. Pushing to "origin" will add your branch to a branch in the main codebase on github, from which you will be able to merge your changes to the main branch (or leave them in the branch in the main codebase without merging)

#### Install backend dependences: 

1. Go into the project root `cd mimo_cat` and then one more time into functions subfolder `cd functions`.
2. From within the functions folder, install dependencies. `npm i`
3. Configuring access with firebase: 
    - Copy the configs from the firebase console under your app settings information page into `config.js`. The *config-example.js* file shows the structure of the file. 

#### Install frontend dependencies:

1. Go into the view subfolder. From the project root, `cd view`
2. install dependecies. Running `npm i` works because there is a `package.json` file in that subfolder that specifies which libraries to install.

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
├── functions               # backend code
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
└── view                    # frontend code
    ├── build               # created from `npm run build`, deployed folder
    ├── package.json        # for npm
    ├── public              # used in producing build folder
    └── src                 # the whole app
        ├── App.js
        ├── components
        │   ├── account.js
        │   ├── media.js
        │   ├── movement.js
        │   └── routine.js
        ├── index.js
        ├── pages
        │   ├── home.js     # defaults to the landing page
        │   ├── login.js
        │   └── signup.js
        ├── setupTests.js
        └── util
            └── auth.js
```


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

* Express http://expressjs.com/

Helpful Links for frontend dev:

* ReactJS Docs https://reactjs.org/
* Create-React-App https://create-react-app.dev/
* Material UI v5 https://next.material-ui.com/
  * In case you're looking for Material-UI v5 changes, check the migration guide https://next.material-ui.com/guides/migration-v4/#pagination

---

## Troubleshooting

* Multiple NVM versions
    From: https://www.digitalocean.com/community/tutorials/nodejs-node-version-manager

    Install NVM

    ```sh
    #install Node Version Manger
    `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash`
    ```

    Settings

    ```sh
    # set $NVM_DIR
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    ```

    Then, set the nvm version you want:
    
    * To install, `nvm install 12`
    * To switch node version, `nvm use 12`


