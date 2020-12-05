# mimo_cat
minimum movement catalog

---

Steps
1. In Firebase console: go to the Functions section and click button 'get started'
2. in terminal of local computer, install firebase command line tools using npm: npm install -g firebase-tools (this is a one time thing on a new computer)
3. In the directory where you want to start your project; `firebase init`
  1. select set up functions only (3rd on list), and use exiesting project. Javascript; no eslint; yes to dependencies installed now
  2. This creates a subfolder, `functions` as its own nodejs app. At the time of this writing it is set to engine node v12.
  3. You should see the message in your console: `Firebase initialization complete!`
  4. Also you now have firebase.json, .firebaserc
4. When you're ready to deploy, `firebase deploy`

getting started https://firebase.google.com/docs/functions/get-started?authuser=2
see some example functions https://github.com/firebase/functions-samples
---

