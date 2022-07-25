require('dotenv');
const express = require('express');
const cors = require('cors');

// const routes = require('./routes');

const people = {
  0: 'Person 1',
  1: 'Person 2',
};

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());
app.use(cors());

// app.use(routes);

app.listen(PORT, () => {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
