# jobify-mern
Full Stack MERN Project


How to run it locally:

npm run setup-production

Here is a list of all the scripts:

"scripts": {
    "setup-production": "npm run install-client && npm run build-client && npm install",
    "install-client": "cd client && npm install", 
    "build-client": "cd client && npm run build",
    "server": "nodemon server --ignore client",
    "client": "npm start --prefix client",
    "start": "concurrently --kill-others-on-fail \"npm run server\" \" npm run client\""
  },
