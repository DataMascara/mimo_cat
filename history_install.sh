# this is a list of the command used in the terminal

# setup commands needed
firebase init
npm i cors firebase-admin

# create files for media api endpoint
mkdir functions/api
touch functions/api/media.js
mkdir functions/util
touch functions/util/admin.js

# create more files for user auth
touch functions/api/users.js
touch functions/util/validators.js
touch functions/util/config.js

# for the file upload, these dependencies are required.
# from within the function directory: 
npm i firebase busboy 

# front end 
npm install -g create-react-app
npx create-react-app view
cd view

# from within the view directory: 
npm start
npm i @material-ui/core@next @emotion/react @emotion/styled
mkdir src/pages
touch src/pages/login.js
npm i  @material-ui/icons axios react-router-dom
touch src/pages/signup.js
touch src/pages/home.js

mkdir src/util
touch src/util/auth.js
npm i dayjs
